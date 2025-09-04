import { Requirement, DiffResult } from '@/types';
import * as diff from 'diff';

export function calculateRequirementsDiff(
  oldRequirements: Requirement[],
  newRequirements: Requirement[]
): DiffResult {
  const added: Requirement[] = [];
  const modified: Requirement[] = [];
  const removed: Requirement[] = [];
  const impactedModules: Set<string> = new Set();

  // Create maps for easier lookup
  const oldMap = new Map(oldRequirements.map(req => [req.id, req]));
  const newMap = new Map(newRequirements.map(req => [req.id, req]));

  // Find removed and modified requirements
  oldRequirements.forEach(oldReq => {
    const newReq = newMap.get(oldReq.id);
    if (!newReq) {
      removed.push(oldReq);
      oldReq.relatedModules.forEach(module => impactedModules.add(module));
    } else if (!areRequirementsEqual(oldReq, newReq)) {
      modified.push(newReq);
      oldReq.relatedModules.forEach(module => impactedModules.add(module));
      newReq.relatedModules.forEach(module => impactedModules.add(module));
    }
  });

  // Find added requirements
  newRequirements.forEach(newReq => {
    if (!oldMap.has(newReq.id)) {
      added.push(newReq);
      newReq.relatedModules.forEach(module => impactedModules.add(module));
    }
  });

  return {
    added,
    modified,
    removed,
    impactedModules: Array.from(impactedModules),
  };
}

function areRequirementsEqual(req1: Requirement, req2: Requirement): boolean {
  return (
    req1.description === req2.description &&
    req1.category === req2.category &&
    req1.priority === req2.priority &&
    req1.testable === req2.testable &&
    JSON.stringify(req1.relatedModules.sort()) === JSON.stringify(req2.relatedModules.sort())
  );
}

export function generateDiffSummary(diffResult: DiffResult): string {
  const lines: string[] = [];
  
  if (diffResult.added.length > 0) {
    lines.push(`**Added Requirements (${diffResult.added.length}):**`);
    diffResult.added.forEach(req => {
      lines.push(`+ ${req.id}: ${req.description}`);
    });
    lines.push('');
  }
  
  if (diffResult.modified.length > 0) {
    lines.push(`**Modified Requirements (${diffResult.modified.length}):**`);
    diffResult.modified.forEach(req => {
      lines.push(`~ ${req.id}: ${req.description}`);
    });
    lines.push('');
  }
  
  if (diffResult.removed.length > 0) {
    lines.push(`**Removed Requirements (${diffResult.removed.length}):**`);
    diffResult.removed.forEach(req => {
      lines.push(`- ${req.id}: ${req.description}`);
    });
    lines.push('');
  }
  
  if (diffResult.impactedModules.length > 0) {
    lines.push(`**Impacted Modules (${diffResult.impactedModules.length}):**`);
    diffResult.impactedModules.forEach(module => {
      lines.push(`• ${module}`);
    });
  }
  
  return lines.join('\n');
}

export function generateTextDiff(oldText: string, newText: string): string {
  const changes = diff.diffLines(oldText, newText);
  let result = '';
  
  changes.forEach(part => {
    const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
    const lines = part.value.split('\n').filter(line => line);
    lines.forEach(line => {
      result += prefix + line + '\n';
    });
  });
  
  return result;
}

export function highlightDifferences(
  oldRequirements: Requirement[],
  newRequirements: Requirement[]
): {
  added: Set<string>;
  modified: Set<string>;
  removed: Set<string>;
} {
  const diffResult = calculateRequirementsDiff(oldRequirements, newRequirements);
  
  return {
    added: new Set(diffResult.added.map(r => r.id)),
    modified: new Set(diffResult.modified.map(r => r.id)),
    removed: new Set(diffResult.removed.map(r => r.id)),
  };
}
