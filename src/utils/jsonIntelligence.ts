export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject { [key: string]: JsonValue; }

export interface QualityIssue {
  severity: 'low' | 'medium' | 'high';
  type: string;
  path: string;
  message: string;
}

export interface JsonMetrics {
  totalNodes: number;
  objects: number;
  arrays: number;
  primitives: number;
  nulls: number;
  maxDepth: number;
  uniqueKeys: number;
}

export interface DiffEntry {
  type: 'ADDED' | 'REMOVED' | 'TYPE_CHANGE' | 'VALUE_CHANGE';
  path: string;
  severity: 'low' | 'medium' | 'high';
  from?: unknown;
  to?: unknown;
  value?: unknown;
}

const getType = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

const formatPath = (path: string) => path || 'root';

export const calculateJsonMetrics = (data: unknown): JsonMetrics => {
  const keys = new Set<string>();
  const metrics: JsonMetrics = {
    totalNodes: 0,
    objects: 0,
    arrays: 0,
    primitives: 0,
    nulls: 0,
    maxDepth: 0,
    uniqueKeys: 0
  };

  const walk = (value: unknown, depth: number) => {
    metrics.totalNodes += 1;
    metrics.maxDepth = Math.max(metrics.maxDepth, depth);

    if (value === null) {
      metrics.nulls += 1;
      metrics.primitives += 1;
      return;
    }

    if (Array.isArray(value)) {
      metrics.arrays += 1;
      value.forEach((item) => walk(item, depth + 1));
      return;
    }

    if (typeof value === 'object') {
      metrics.objects += 1;
      Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
        keys.add(key);
        walk(child, depth + 1);
      });
      return;
    }

    metrics.primitives += 1;
  };

  walk(data, 1);
  metrics.uniqueKeys = keys.size;
  return metrics;
};

export const generateSchema = (value: unknown): unknown => {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return ['empty'];
    return [mergeArraySchemas(value.map(generateSchema))];
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, generateSchema(child)])
    );
  }
  return typeof value;
};

const mergeArraySchemas = (schemas: unknown[]): unknown => {
  const unique = Array.from(new Set(schemas.map((schema) => JSON.stringify(schema))));
  if (unique.length === 1) return JSON.parse(unique[0]);
  return unique.map((schema) => JSON.parse(schema));
};

const toInterfaceName = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') || 'Root';

export const generateTypeScriptInterface = (data: unknown, rootName = 'RootResponse'): string => {
  const interfaces: string[] = [];
  const seen = new Set<string>();

  const typeForValue = (value: unknown, name: string): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const itemTypes = Array.from(new Set(value.map((item) => typeForValue(item, `${name}Item`))));
      return `(${itemTypes.join(' | ')})[]`;
    }
    if (typeof value === 'object') {
      const interfaceName = toInterfaceName(name);
      buildInterface(value as Record<string, unknown>, interfaceName);
      return interfaceName;
    }
    return typeof value;
  };

  const buildInterface = (obj: Record<string, unknown>, name: string) => {
    if (seen.has(name)) return;
    seen.add(name);

    const fields = Object.entries(obj).map(([key, value]) => {
      const optional = value === null ? '?' : '';
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      return `  ${safeKey}${optional}: ${typeForValue(value, key)};`;
    });

    interfaces.push(`export interface ${name} {\n${fields.join('\n')}\n}`);
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    buildInterface(data as Record<string, unknown>, rootName);
  } else {
    interfaces.push(`export type ${rootName} = ${typeForValue(data, rootName)};`);
  }

  return interfaces.join('\n\n');
};

export const analyzeQuality = (data: unknown): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  const walk = (value: unknown, path: string, depth: number) => {
    if (depth > 7) {
      issues.push({
        severity: 'medium',
        type: 'DEEP_NESTING',
        path: formatPath(path),
        message: 'Deep nesting can make API responses harder to consume and maintain.'
      });
    }

    if (value === null) {
      issues.push({
        severity: 'low',
        type: 'NULL_VALUE',
        path: formatPath(path),
        message: 'Null value detected. Confirm whether consumers handle this case.'
      });
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        issues.push({ severity: 'low', type: 'EMPTY_ARRAY', path: formatPath(path), message: 'Empty array detected.' });
      }

      const objectKeys = value
        .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
        .map((item) => Object.keys(item as Record<string, unknown>).sort().join('|'));

      if (new Set(objectKeys).size > 1) {
        issues.push({
          severity: 'high',
          type: 'INCONSISTENT_ARRAY_SHAPE',
          path: formatPath(path),
          message: 'Objects in this array do not all share the same field structure.'
        });
      }

      value.forEach((item, index) => walk(item, `${path}[${index}]`, depth + 1));
      return;
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        issues.push({ severity: 'low', type: 'EMPTY_OBJECT', path: formatPath(path), message: 'Empty object detected.' });
      }
      entries.forEach(([key, child]) => walk(child, path ? `${path}.${key}` : key, depth + 1));
    }
  };

  walk(data, '', 1);
  return issues.slice(0, 75);
};

export const diffJson = (before: unknown, after: unknown, path = ''): DiffEntry[] => {
  const beforeType = getType(before);
  const afterType = getType(after);

  if (beforeType !== afterType) {
    return [{ type: 'TYPE_CHANGE', path: formatPath(path), severity: 'high', from: beforeType, to: afterType }];
  }

  if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object') {
    return before !== after ? [{ type: 'VALUE_CHANGE', path: formatPath(path), severity: 'low', from: before, to: after }] : [];
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    const max = Math.max(before.length, after.length);
    return Array.from({ length: max }).flatMap((_, index) => {
      const nextPath = `${path}[${index}]`;
      if (index >= before.length) return [{ type: 'ADDED' as const, path: formatPath(nextPath), severity: 'low' as const, value: after[index] }];
      if (index >= after.length) return [{ type: 'REMOVED' as const, path: formatPath(nextPath), severity: 'medium' as const, value: before[index] }];
      return diffJson(before[index], after[index], nextPath);
    });
  }

  const beforeObj = before as Record<string, unknown>;
  const afterObj = after as Record<string, unknown>;
  const keys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);

  return Array.from(keys).flatMap((key) => {
    const nextPath = path ? `${path}.${key}` : key;
    if (!(key in beforeObj)) return [{ type: 'ADDED' as const, path: formatPath(nextPath), severity: 'low' as const, value: afterObj[key] }];
    if (!(key in afterObj)) return [{ type: 'REMOVED' as const, path: formatPath(nextPath), severity: 'high' as const, value: beforeObj[key] }];
    return diffJson(beforeObj[key], afterObj[key], nextPath);
  });
};

export const buildMarkdownReport = (source: string, data: unknown): string => {
  const metrics = calculateJsonMetrics(data);
  const issues = analyzeQuality(data);
  const schema = generateSchema(data);
  const tsInterface = generateTypeScriptInterface(data);

  return `# Graph LM Pro Analysis Report\n\nSource: ${source || 'Untitled JSON'}\nGenerated: ${new Date().toLocaleString()}\n\n## Metrics\n\n- Total nodes: ${metrics.totalNodes}\n- Objects: ${metrics.objects}\n- Arrays: ${metrics.arrays}\n- Primitive values: ${metrics.primitives}\n- Null values: ${metrics.nulls}\n- Max depth: ${metrics.maxDepth}\n- Unique keys: ${metrics.uniqueKeys}\n\n## Quality Issues\n\n${issues.length ? issues.map((issue) => `- **${issue.severity.toUpperCase()}** ${issue.path}: ${issue.message}`).join('\n') : '- No major issues detected.'}\n\n## Generated Schema\n\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\`\n\n## TypeScript Interface\n\n\`\`\`ts\n${tsInterface}\n\`\`\`\n`;
};
