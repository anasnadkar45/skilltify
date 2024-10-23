"use client"

import React, { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { CircleDashed, Briefcase, FileText, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFormState } from "react-dom"
import { useForm } from '@conform-to/react'
import { parseWithZod } from "@conform-to/zod"
// import { interviewPrepSchema } from "@/app/lib/zodSchemas"
import { SubmitButton } from "@/app/components/global/SubmitButton"

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

export default function EnhancedInterviewPrepTool() {
  const [file, setFile] = useState<File | null>(null)
  const [generating, setGenerating] = useState(false)
  const [prepPlan, setPrepPlan] = useState<any>(null)
//   const [lastResult, action] = useFormState(InterviewPrepAction, undefined)
//   const [form, fields] = useForm({
//     lastResult,
//     onValidate({ formData }) {
//       return parseWithZod(formData, { schema: interviewPrepSchema })
//     },
//     shouldValidate: "onBlur",
//     shouldRevalidate: "onInput",
//   })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)

    const genAI = new GoogleGenerativeAI(geminiApiKey!)

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

      let content = []
      if (file) {
        const base64Data = await readFileAsBase64(file)
        content.push({
          inlineData: {
            data: base64Data.split(",")[1],
            mimeType: file.type,
          },
        })
      }

      const formData = new FormData(e.target as HTMLFormElement)
      const prompt = `You are an expert interview preparation coach for computer science students. Based on the following information and any uploaded resume, create a personalized interview preparation plan:

      Interview Type: ${formData.get('interviewType')}
      Tech Stack: ${formData.get('techStack')}
      Years of Experience: ${formData.get('experience')}
      Interview Difficulty: ${formData.get('difficulty')}
      Role Level: ${formData.get('roleLevel')}
      Company: ${formData.get('companyName')}
      Additional Information: ${formData.get('additionalInfo')}

      Please provide a plan that includes:
      1. A summary of key areas to focus on
      2. A daily study schedule for the week leading up to the interview
      3. Important topics to review
      4. Sample interview questions and answers
      5. Coding challenges to practice
      6. Behavioral interview tips
      7. Resources for further study

      Format the response as a JSON object with the following structure:
      {
        "summary": "Brief summary of the preparation plan",
        "dailySchedule": [
          {
            "day": 1,
            "tasks": ["Task 1", "Task 2"],
            "topics": ["Topic 1", "Topic 2"],
            "duration": "X hours",
            "resources": [
              {
                "topic": "Topic 1",
                "website": "https://example.com/topic1",
                "description": "Resource for further learning of Topic 1"
              }
            ],
            "quiz": {
              "questions": [
                {
                  "question": "Sample question for Topic 1",
                  "answer": "Sample answer for Topic 1"
                }
              ]
            }
          }
        ],
        "keyTopics": ["Topic 1", "Topic 2"],
        "sampleQuestions": [
          {
            "question": "Sample interview question",
            "answer": "Sample answer"
          }
        ],
        "codingChallenges": [
          {
            "title": "Challenge title",
            "description": "Challenge description",
            "difficulty": "Easy/Medium/Hard"
          }
        ],
        "behavioralTips": ["Tip 1", "Tip 2"],
        "resources": [
          {
            "title": "Resource title",
            "url": "https://example.com",
            "description": "Brief description of the resource"
          }
        ]
      }`

      const result = await model.generateContent([prompt, ...content])
      const response = await result.response
      const text = await response.text()
      const cleanedContent = text.replace(/```json/g, "").replace(/```/g, "").trim()
      const jsonData = JSON.parse(cleanedContent)

      setPrepPlan(jsonData)
      toast.success("Interview preparation plan generated successfully!")
    } catch (error) {
      console.error("Error generating interview prep plan:", error)
      toast.error("Error generating interview prep plan. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Interview Prep Tool for CS Students</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="interviewType">Interview Type</Label>
                <Select name="interviewType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                    <SelectItem value="mobile">Mobile Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input
                  id="techStack"
                  placeholder="e.g., React, Node.js, Docker"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select name="experience" >
                  <SelectTrigger>
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Interview Difficulty</Label>
                <Select name="difficulty" >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleLevel">Role Level</Label>
                <Select name="roleLevel" >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior Developer</SelectItem>
                    <SelectItem value="mid">Mid-Level Developer</SelectItem>
                    <SelectItem value="senior">Senior Developer</SelectItem>
                    <SelectItem value="lead">Lead Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., Google, Amazon, Microsoft"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any specific areas you want to focus on or additional context about the interview"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume">Upload Resume (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="resume"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 transition-colors duration-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                  </div>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected file: {file.name}
                </p>
              )}
            </div>
            {prepPlan ? (
              <SubmitButton className="w-full" text="Create Interview Prep Plan" />
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-4 w-4" /> Generate Interview Prep Plan
                  </>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {prepPlan && (
        <Card className="w-full mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Personalized Interview Prep Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p>{prepPlan.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Daily Schedule</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {prepPlan.dailySchedule.map((day: any, index: number) => (
                      <AccordionItem key={index} value={`day-${day.day}`}>
                        <AccordionTrigger>Day {day.day} - {day.duration}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold">Tasks:</h4>
                              <ul className="list-disc list-inside">
                                {day.tasks.map((task: string, taskIndex: number) => (
                                  <li key={taskIndex}>{task}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Topics:</h4>
                              <ul className="list-disc list-inside">
                                {day.topics.map((topic: string, topicIndex: number) => (
                                  <li key={topicIndex}>{topic}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Resources:</h4>
                              <ul className="list-disc list-inside">
                                {day.resources.map((resource: any, rIndex: number) => (
                                  <li key={rIndex}>
                                    <a href={resource.website} target="_blank" rel="noopener noreferrer" 
                                       className="text-blue-600 hover:underline">
                                      {resource.topic}
                                    </a>
                                    : {resource.description}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Quiz:</h4>
                              <Accordion type="single" collapsible className="w-full">
                                {day.quiz.questions.map((q: any, qIndex: number) => (
                                  <AccordionItem key={qIndex} value={`question-${qIndex}`}>
                                    <AccordionTrigger>{q.question}</AccordionTrigger>
                                    <AccordionContent>{q.answer}</AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Topics to Review</h3>
                  <ul className="list-disc list-inside">
                    {prepPlan.keyTopics.map((topic: string, index: number) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Sample Interview Questions</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {prepPlan.sampleQuestions.map((qa: any, index: number) => (
                      <AccordionItem key={index} value={`question-${index}`}>
                        <AccordionTrigger>{qa.question}</AccordionTrigger>
                        <AccordionContent>{qa.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Coding Challenges</h3>
                  <div className="space-y-4">
                    {prepPlan.codingChallenges.map((challenge: any, index: number) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{challenge.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{challenge.description}</p>
                          <p className="mt-2 text-sm text-muted-foreground">Difficulty: {challenge.difficulty}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Behavioral Interview Tips</h3>
                  <ul className="list-disc list-inside">
                    {prepPlan.behavioralTips.map((tip: string, index: number) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Additional Resources</h3>
                  <div className="space-y-2">
                    {prepPlan.resources.map((resource: any, index: number) => (
                      <div key={index}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {resource.title}
                        </a>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}