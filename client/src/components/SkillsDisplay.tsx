import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code, Database, Palette, Settings, Users } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Skill {
  name: string;
  category: string;
  confidence?: number;
  source?: string;
}

export interface SkillCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: Skill[];
  color: string;
}

interface SkillsDisplayProps {
  categories?: SkillCategory[];
  totalSkillsFound?: number;
}

const defaultCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    icon: Code,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    skills: [
      { name: "JavaScript", category: "Programming Languages", confidence: 100 },
      { name: "Python", category: "Programming Languages", confidence: 100 },
      { name: "TypeScript", category: "Programming Languages", confidence: 100 },
      { name: "Java", category: "Programming Languages", confidence: 100 }
    ]
  },
  {
    name: "Frameworks & Libraries",
    icon: Settings,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
    skills: [
      { name: "React", category: "Frameworks & Libraries", confidence: 100 },
      { name: "Node.js", category: "Frameworks & Libraries", confidence: 100 },
      { name: "Express.js", category: "Frameworks & Libraries", confidence: 100 },
      { name: "Django", category: "Frameworks & Libraries", confidence: 100 }
    ]
  },
  {
    name: "Databases",
    icon: Database,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
    skills: [
      { name: "PostgreSQL", category: "Databases", confidence: 100 },
      { name: "MongoDB", category: "Databases", confidence: 100 },
      { name: "Redis", category: "Databases", confidence: 100 }
    ]
  },
  {
    name: "Design & UI",
    icon: Palette,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
    skills: [
      { name: "Figma", category: "Design & UI", confidence: 100 },
      { name: "Tailwind CSS", category: "Design & UI", confidence: 100 },
      { name: "CSS", category: "Design & UI", confidence: 100 }
    ]
  },
  {
    name: "Soft Skills",
    icon: Users,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
    skills: [
      { name: "Team Leadership", category: "Soft Skills", confidence: 100 },
      { name: "Project Management", category: "Soft Skills", confidence: 100 },
      { name: "Communication", category: "Soft Skills", confidence: 100 }
    ]
  }
];

export default function SkillsDisplay({ categories = defaultCategories, totalSkillsFound }: SkillsDisplayProps) {
  const [selectedSource, setSelectedSource] = useState<string>("detected");
  
  // Filter categories based on selected source
  const filteredCategories = categories.map(category => {
    if (selectedSource === "detected") {
      // Show only detected skills (non-suggested)
      if (category.name === "Suggested Skills") {
        return { ...category, skills: [] };
      }
      return category;
    } else if (selectedSource === "suggested") {
      // Show only suggested skills
      if (category.name === "Suggested Skills") {
        return category;
      }
      return { ...category, skills: [] };
    }
    
    return category;
  }).filter(category => category.skills.length > 0);
  
  const totalSkills = totalSkillsFound ?? filteredCategories.reduce((sum, cat) => sum + cat.skills.length, 0);

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold" data-testid="text-skills-found">
                {totalSkills > 0 ? totalSkills : "Loading"} {totalSkills === 1 ? "skill" : "skills"} {totalSkills > 0 ? "detected" : "..."}
              </h3>
              <p className="text-muted-foreground">
                Skills extracted from your resume across {filteredCategories.filter(cat => cat.name !== "Suggested Skills").length > 0 ? filteredCategories.filter(cat => cat.name !== "Suggested Skills").length : "..."} {filteredCategories.filter(cat => cat.name !== "Suggested Skills").length === 1 ? "category" : "categories"}
              </p>
            </div>
          </div>
          
          {/* Source Toggle */}
          <div className="mt-4">
            <Tabs defaultValue="detected" value={selectedSource} onValueChange={setSelectedSource} className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger value="detected">Skills Detected</TabsTrigger>
                <TabsTrigger value="suggested">Suggested Skills</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Skills by Category */}
      <div className="grid gap-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.name}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5" />
                  {category.name}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({category.skills.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge 
                      key={skill.name} 
                      variant={skill.category === "Suggested" ? "outline" : "secondary"}
                      className={`${skill.category === "Suggested" ? "bg-amber-50 text-amber-700 border-amber-500 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600" : category.color} hover-elevate cursor-default`}
                      data-testid={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {skill.category === "Suggested" && <span className="mr-1">➕</span>}
                      {skill.name}
                      {skill.confidence && (
                        <span className="ml-1 text-xs opacity-75">
                          {skill.confidence}%
                        </span>
                      )}
                      {skill.category === "Suggested" && (
                        <span className="ml-1 text-xs font-medium">
                          (suggested)
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}