"use client";
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CircleDashed, UploadIcon } from "lucide-react";
import FileUploadModal from "@/app/components/paper-builder/FileUploadModal";
import Markdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

// Replace with your actual API key
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const PaperBuilder: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<string>("");
    const [filename, setFilename] = useState<string>("");
    const [filetype, setFileType] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    console.log(analysisResult);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            console.log("Selected file:", selectedFile);
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

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            // const prompt = `You are an expert career consultant and resume reviewer. Your task is to review the following resume and provide constructive feedback. The feedback should include:

            // 1. **Strengths**: List the positive aspects of the resume and highlight the areas where the candidate is performing well.
            // 2. **Areas for Improvement**: Provide suggestions on what can be improved or optimized for a better impression.
            // 3. **Keywords to Include**: Identify industry-relevant keywords or skills that should be added to make the resume more aligned with the candidate's field and make it stand out to recruiters and Applicant Tracking Systems (ATS).
            // 4. **Content to Remove**: Suggest any content, sections, or phrases that should be removed or modified to streamline the resume and make it more concise and relevant.
            // 5. **Summary**: Give a short, clear summary of the candidate's resume, capturing their experience, skills, and qualifications in 2-3 sentences.
            // `;
            const prompt = `You are an expert educational content planner. Based on the following text extracted from a PDF document, generate a structured study schedule that includes:

1. A concise summary of the key concepts and important details in the text.
2. A set of 50 exam questions with their answers that may arise from the content, covering critical thinking aspects related to the material.
3. A daily study plan that outlines recommended study sessions, duration for each session, and the topics or questions to focus on each day.

Ensure that the study schedule is clear and easy to follow, allowing the user to effectively prepare for the exam.`;

            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = await response.text();
            setAnalysisResult(text);
            setUploadSuccess(true);
            setIsModalOpen(false); // Close the modal after a successful upload
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

    return (
        <ScrollArea className="h-[calc(100vh-1.75rem)] w-full">
            <div className="flex flex-col justify-center items-center">
                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
                >
                    <UploadIcon />
                    Upload Sylabus or a Book
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
                <div className="space-y-2 p-2 text-muted-foreground">
                    <Markdown>{analysisResult}</Markdown>
                </div>
            </div>
        </ScrollArea>
    );
};

export default PaperBuilder;
