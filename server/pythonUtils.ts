import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executes a Python script with the given arguments and returns the output
 * @param scriptPath Path to the Python script
 * @param args Arguments to pass to the script
 * @returns Promise with the script output
 */
export async function executePythonScript(scriptPath: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    // Use python3 or python depending on the environment
    const pythonProcess = spawn('python', [scriptPath, ...args]);
    
    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
      } else {
        resolve(output);
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
}

/**
 * Type definition for skill with confidence
 */
export interface Skill {
  name: string;
  confidence: number;
}

/**
 * Type definition for categorized skills
 */
export interface CategorizedSkills {
  skills: string[];
  categorized_skills: Record<string, Skill[]>;
  total_skills: number;
  total_categories: number;
}

/**
 * Extracts skills from a PDF resume using the Python skill extractor
 * @param pdfPath Path to the PDF file
 * @returns Promise with the extracted skills and their categories
 */
export async function extractSkillsFromResume(pdfPath: string): Promise<CategorizedSkills> {
  try {
    const scriptPath = path.resolve(__dirname, '../SkillExtraction/resume_skill_extractor.py');
    const output = await executePythonScript(scriptPath, [pdfPath]);
    
    // Parse the JSON output from the Python script
    const jsonMatch = output.match(/JSON output:\s*(\{.*\})/s);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonData = JSON.parse(jsonMatch[1]) as CategorizedSkills;
        return {
          skills: jsonData.skills || [],
          categorized_skills: jsonData.categorized_skills || {},
          total_skills: jsonData.total_skills || 0,
          total_categories: jsonData.total_categories || 0
        };
      } catch (e) {
        console.error('Failed to parse JSON output:', e);
      }
    }
    
    // Fallback: Parse the text output if JSON parsing fails
    const skills: string[] = [];
    const lines = output.split('\n');
    let inSkillsSection = false;
    
    for (const line of lines) {
      if (line.includes('Extracted skills found in resume')) {
        inSkillsSection = true;
        continue;
      }
      
      if (inSkillsSection && line.startsWith('-')) {
        const skill = line.substring(1).trim().toLowerCase();
        if (skill) {
          skills.push(skill);
        }
      }
      
      if (inSkillsSection && line.includes('JSON output')) {
        break;
      }
    }
    
    // Return a basic structure if JSON parsing failed
    return {
      skills: skills,
      categorized_skills: { "Other": skills.map(s => ({ name: s, confidence: 100 })) },
      total_skills: skills.length,
      total_categories: skills.length > 0 ? 1 : 0
    };
  } catch (error) {
    console.error('Error extracting skills:', error);
    throw error;
  }
}