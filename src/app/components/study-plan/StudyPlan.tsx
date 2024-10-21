"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, ChevronDown, ChevronUp, Clock } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Plan interface to represent the plan object
interface Plan {
    id: string;
    title: string;
    content: string;
}

// StudyPlanData interface to represent the parsed JSON content
interface StudyPlanData {
    summary: string;
    studyPlan: {
        dailySessions: {
            day: number;
            topics: string[];
            duration: string;
            quiz?: {
                questions: {
                    question: string;
                    answer: string;
                }[];
            };
        }[];
    };
    questions: {
        type: string;
        question: string;
        options?: string[];
        details: string;
    }[];
}

// Question interface to type exam questions
interface Question {
    type: string;
    question: string;
    options?: string[];
    details: string;
}

// Props interface to pass the plan
interface StudyPlanProps {
    plan: Plan;
}

export const StudyPlan: React.FC<StudyPlanProps> = ({ plan }) => {
    const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null); // Type the studyPlan state with StudyPlanData or null
    const [expandedDay, setExpandedDay] = useState<number | null>(null); // expandedDay is either a number (representing the day) or null

    // Effect to parse the plan content from JSON
    useEffect(() => {
        const rawContent = plan.content;
        const cleanedContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

        console.log("Cleaned Content:", cleanedContent);

        try {
            const jsonData: StudyPlanData = JSON.parse(cleanedContent); // Parse and cast the JSON as StudyPlanData
            setStudyPlan(jsonData); // Set the parsed study plan
            console.log("Parsed JSON Data:", jsonData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }, [plan.content]); // Effect will run when the `plan.content` changes

    // Function to toggle the expanded day
    const toggleDay = (day: number) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    return (
        <div key={plan.id} className="p-4 w-full">
            <h1 className="text-3xl font-bold mb-6 text-center">{plan.title}</h1>

            {studyPlan && (
                <div className="space-y-6">
                    {/* Study Plan Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center sm:text-left">
                                Study Plan Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300">{studyPlan.summary}</p>
                        </CardContent>
                    </Card>

                    {/* Daily Study Plan */}
                    <h3 className="text-lg font-semibold text-center sm:text-left">Daily Study Plan</h3>
                    {studyPlan.studyPlan?.dailySessions?.map((session, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className="cursor-pointer" onClick={() => toggleDay(session.day)}>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-semibold">Day {session.day}</CardTitle>
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
                                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                                    <span className="font-medium">Topics:</span>
                                                </div>
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
                                                    {session.quiz.questions.map((quiz, i) => (
                                                        <div key={i}>
                                                            <h1 className="font-semibold text-xl">{quiz.question}</h1>
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

                    {/* Exam Questions */}
                    <h3 className="text-lg font-semibold text-center sm:text-left">Exam Questions</h3>
                    {studyPlan.questions.length > 0 ? (
                        <div className="space-y-2">
                            {studyPlan.questions.map((question, index) => (
                                <Card key={index} className="p-4">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold">
                                            {question.type} Question
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-medium">{question.question}</p>
                                        {question.options && (
                                            <ul className="ml-4 list-disc">
                                                {question.options.map((option, i) => (
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
                        <p className="text-gray-500 text-center">No questions available.</p>
                    )}
                </div>
            )}
        </div>
    );
};
