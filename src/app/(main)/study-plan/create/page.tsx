"use client";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CircleDashed, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { StudyPlanAction } from "@/app/action";
import { useForm } from '@conform-to/react';
import { parseWithZod } from "@conform-to/zod";
import { studyPlanSchema } from "@/app/lib/zodSchemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/app/components/global/SubmitButton";
import { JSONContent } from "novel";

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const StudyPlanBuilder: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [studyPlan, setStudyPlan] = useState<JSONContent>(); // Store output as JSON
    const [title, setTitle] = useState<string>("");
    const [filetype, setFileType] = useState<string>("");
    const [lastResult, action] = useFormState(StudyPlanAction, undefined);
    const [form, fields] = useForm({
        // Sync the result of last submission
        lastResult,

        // Reuse the validation logic on the client
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: studyPlanSchema });
        },

        // Validate the form on blur event triggered
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFileType(selectedFile.type);
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
        if (!file) {
            toast.error("Please upload a file before submitting.");
            return;
        }

        setUploading(true);
        setUploadSuccess(false);

        const genAI = new GoogleGenerativeAI(geminiApiKey!);

        try {
            const base64Data = await readFileAsBase64(file);
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
            let jsonResult;
            try {
                // Parse the cleaned text as JSON
                jsonResult = JSON.parse(text);
            } catch (jsonError) {
                console.error("JSON parse error:", jsonError);
                toast.error("Failed to parse JSON response.");
                return; // Exit if JSON parsing fails
            }

            setStudyPlan(jsonResult); // Store the result as JSON

            // if (studyPlan !== null) {
            //     setUploadSuccess(true);
            // }

            setFile(null);
            setFileType("");
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file.");
            setUploadSuccess(false);
        } finally {
            setUploading(false);
        }
    };

    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        if (fields.title.value !== '') {
            setStep(2);
        }
    };

    // if (form.status === 'success') {
    //     toast.success("Study plan uploaded successfully!");
    // } else {
    //     toast.error("Study plan could not be uploaded!");
    // }

    console.log(studyPlan)
    console.log(title)
    return (
        <ScrollArea className="h-[calc(100vh-1.75rem)] w-full">
            <div className="flex flex-col justify-center items-center">
                <Card className="w-full max-w-md mx-auto">
                    {/* <CardHeader>
                        <CardTitle>{step === 1 ? 'Enter Title' : 'Upload PDF'}</CardTitle>
                    </CardHeader>
                    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                        <CardContent>
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter the title"
                                        name={fields.title.name}
                                        defaultValue={fields.title.initialValue}
                                        key={fields.title.key}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <p className="text-red-500 text-sm">{fields.title.errors}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">Title: {title}</p>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="pdf-upload">Upload PDF</Label>

                                        <Input
                                            id="content"
                                            type="file"
                                            accept=".pdf"
                                            name={fields.content.name}
                                            defaultValue={fields.content.initialValue}
                                            key={fields.content.key}
                                            onChange={handleFileChange}
                                        />
                                        <p className="text-red-500 text-sm">{fields.content.errors}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            {step === 1 ? (
                                <Button onClick={handleNextStep} disabled={fields.title.value === ''}>
                                    Next
                                </Button>
                            ) : (
                                <div>
                                    {uploading && (
                                        <CircleDashed
                                            size={15}
                                            className="mr-3 mt-3 h-7 w-5 animate-spin text-foreground"
                                        />
                                    )}
                                    {studyPlan !== null ? (
                                        <SubmitButton className="w-full" text="Submit" />
                                    ) : (
                                        <Button className="w-full" onClick={handleFileUpload}>
                                            <Upload className="mr-2 h-4 w-4" /> Upload PDF
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardFooter>
                    </form> */}
                    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                        <div className="space-y-4">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter the title"
                                name={fields.title.name}
                                defaultValue={fields.title.initialValue}
                                key={fields.title.key}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <p className="text-red-500 text-sm">{fields.title.errors}</p>
                            <SubmitButton className="w-full" text="Submit" />
                        </div>
                    </form>
                </Card>
            </div>
        </ScrollArea>
    );
};

export default StudyPlanBuilder;
