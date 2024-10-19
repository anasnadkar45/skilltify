"use client";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UploadIcon } from "lucide-react";
import FileUploadModal from "@/app/components/paper-builder/FileUploadModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const PaperBuilder: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [studyPlan, setStudyPlan] = useState<any>(null); // Store output as JSON
    const [questions, setQuestions] = useState<any[]>([]); // Store questions
    const [filename, setFilename] = useState<string>("");
    const [filetype, setFileType] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    console.log(studyPlan)
    console.log(questions)

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFileType(selectedFile.type);
            setFilename(selectedFile.name);
            setFile(selectedFile);
        }
    };

    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async () => {
        setUploading(true);
        setUploadSuccess(false);

        const genAI = new GoogleGenerativeAI(geminiApiKey!);

        try {
            const base64Data = await readFileAsBase64(file!);
            const imageParts = [
                {
                    inlineData: {
                        data: base64Data.split(",")[1],
                        mimeType: filetype,
                    },
                },
            ];

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `You are an expert educational planner. Based on the following content extracted from a PDF document, generate a personalized study plan in JSON format and 50 exam questions with their detailed answers in brief for each type of question, including fill-in-the-blanks, multiple-choice, short answers, and brief answers. The study plan should include the following fields:
            {
              "summary": "A concise summary of the key concepts and important details found in the text.",
              "studyPlan": {
                "dailySessions": [
                  {
                    "day": 1,
                    "topics": ["Topic 1", "Topic 2"],
                    "duration": "2 hours",
                    "quiz": {
                      "questions": [
                        {
                          "question": "What is Topic 1?",
                          "answer": "Topic 1 is..."
                        }
                      ]
                    }
                  },
                  {
                    "day": 2,
                    "topics": ["Topic 3", "Topic 4"],
                    "duration": "1.5 hours"
                  }
                ],
                "finalExamPreparation": {
                  "revision": ["Topic 1", "Topic 2"],
                  "mockExam": "Complete the mock exam covering all topics."
                }
              },
              "questions": [
                {
                  "type": "multiple choice",
                  "question": "What is the capital of France?",
                  "options": ["Berlin", "Madrid", "Paris", "Lisbon"],
                  "answer": "Paris",
                  "details": "Paris is the capital city of France."
                },
                ...
              ]
            }
            Ensure the JSON structure is properly formatted.`;

            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            let text = await response.text();

            // Clean the response by removing markdown code block symbols
            text = text.replace(/```json/g, "").replace(/```/g, "");

            // Parse the cleaned text as JSON
            const jsonResult = JSON.parse(text);

            setStudyPlan(jsonResult); // Store the result as JSON
            setQuestions(jsonResult.questions); // Store questions
            setUploadSuccess(true);
            setIsModalOpen(false);
            setFilename("");
            setFile(null);
            setFileType("");
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadSuccess(false);
        } finally {
            setUploading(false);
        }
    };

    const toggleDay = (day: number) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    return (
        <ScrollArea className="h-[calc(100vh-1.75rem)] w-full">
            <div className="flex flex-col justify-center items-center">
                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
                >
                    <UploadIcon />
                    Upload Syllabus or Book
                </button>
                <FileUploadModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onFileChange={handleFileChange}
                    onFileUpload={handleFileUpload}
                    uploading={uploading}
                    uploadSuccess={uploadSuccess}
                    filename={filename}
                />

                {studyPlan && (
                    <div className="space-y-4 p-4 w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Study Plan Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 dark:text-gray-300">{studyPlan.summary}</p>
                            </CardContent>
                        </Card>

                        <h3 className="text-lg font-semibold">Daily Study Plan</h3>
                        {studyPlan.studyPlan?.dailySessions?.map((session: any, index: number) => (
                            <Card key={index} className="overflow-hidden">
                                <CardHeader
                                    className="cursor-pointer"
                                    onClick={() => toggleDay(session.day)}
                                >
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-semibold">
                                            Day {session.day}
                                        </CardTitle>
                                        <Button variant="ghost" size="icon">
                                            {expandedDay === session.day ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <AnimatePresence>
                                    {expandedDay === session.day && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center space-x-2">
                                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                                    <span className="font-medium">Topics:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {session.topics.map((topic: string, i: number) => (
                                                            <Badge key={i} className="bg-orange-500">
                                                                {topic}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-5 w-5 text-green-500" />
                                                    <span className="font-medium">Duration:</span>
                                                    <span>{session.duration}</span>
                                                </div>
                                                {session.quiz && (
                                                    <div className="mt-4 space-y-2">
                                                        <h4 className="text-lg font-semibold flex items-center">
                                                            <Brain className="h-5 w-5 text-purple-500 mr-2" />
                                                            Quiz Questions
                                                        </h4>
                                                        {session.quiz.questions.map((quiz: any, i: number) => (
                                                            <div key={i}>
                                                                <h1 className="font-semibold text-2xl">{quiz.question}</h1>
                                                                <p className="text-gray-700 dark:text-gray-300">{quiz.answer}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        ))}

                        <h3 className="text-lg font-semibold">Exam Questions</h3>
                        {questions.length > 0 ? (
                            <div className="space-y-2">
                                {questions.map((question, index) => (
                                    <Card key={index} className="p-4">
                                        <CardHeader>
                                            <CardTitle className="text-xl font-semibold">{question.type} Question</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="font-medium">{question.question}</p>
                                            {question.options && (
                                                <ul className="ml-4 list-disc">
                                                    {question.options.map((option: string, i: number) => (
                                                        <li key={i}>{option}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            <p className="text-gray-700 dark:text-gray-300">{question.details}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No questions available.</p>
                        )}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};

export default PaperBuilder;
