'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Clipboard, Printer, Upload, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from "@/hooks/use-toast";
import { getInterviewQuestions } from '@/app/actions';
import { Icons } from '@/components/icons';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

const formSchema = z.object({
  resumeFile: z
    .any()
    .refine((files) => files?.length === 1, 'Resume file is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf and .doc/.docx files are accepted.'
    ),
  skills: z.string({ required_error: 'Skills are required.' }).min(1, {
    message: 'Please enter at least one skill.',
  }),
  questionFormat: z.enum(['MCQs', 'Fill in the Blanks', 'Theoretical'], {
    required_error: 'You need to select a question format.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export default function Home() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: '',
      questionFormat: 'Theoretical',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedQuestions([]);
    
    try {
        const resumeDataUri = await fileToDataUri(values.resumeFile[0]);
        const result = await getInterviewQuestions({
            resumeDataUri: resumeDataUri,
            skills: values.skills,
            questionFormat: values.questionFormat,
        });

        if (result.success && result.questions) {
            setGeneratedQuestions(result.questions);
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: result.error || 'An unexpected error occurred.',
            });
        }
    } catch(error) {
        console.error("Error processing form:", error);
        toast({
            variant: "destructive",
            title: "File processing error.",
            description: "Could not read the uploaded file. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleExport = (type: 'copy' | 'print') => {
    const content = generatedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    if (type === 'copy') {
      navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard!",
        description: "Questions have been copied.",
      });
    } else if (type === 'print') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<html><head><title>SkillScout Questions</title><style>body{font-family: sans-serif; line-height: 1.5; color: #333;} pre{white-space: pre-wrap; word-wrap: break-word;}</style></head><body><h1>Generated Interview Questions</h1><pre>${content}</pre></body></html>`);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const selectedFile = form.watch('resumeFile')?.[0];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3a8dde] to-[#8f3de4] bg-clip-text text-transparent">
            SkillScout
          </h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 items-start">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Create Your Interview</CardTitle>
              <CardDescription>
                Upload a resume, select skills, and choose a format to generate tailored interview questions.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="resumeFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                                type="file" 
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => field.onChange(e.target.files)}
                                accept=".pdf,.doc,.docx"
                            />
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full justify-start text-left font-normal"
                            >
                                <Upload className="mr-2"/>
                                {selectedFile ? selectedFile.name : 'Upload your resume'}
                            </Button>
                             {selectedFile && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4"/>
                                    <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                             )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          PDF or Word document (max 5MB).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills to Focus On</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., React, Node.js, AWS" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a comma-separated list of skills.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="questionFormat"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Question Format</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Theoretical" />
                              </FormControl>
                              <FormLabel className="font-normal">Theoretical</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="MCQs" />
                              </FormControl>
                              <FormLabel className="font-normal">MCQs</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Fill in the Blanks" />
                              </FormControl>
                              <FormLabel className="font-normal">Fill in the Blanks</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Generating...' : 'Generate Questions'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <div className="w-full space-y-4 max-w-4xl mx-auto">
            {isLoading && (
              <Card className="flex items-center justify-center p-16">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating your questions... this might take a moment.</p>
                </div>
              </Card>
            )}

            {generatedQuestions.length > 0 && !isLoading && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <CardTitle className="font-headline text-xl">Generated Questions</CardTitle>
                      <CardDescription>Here are the questions tailored for you.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleExport('copy')}>
                        <Clipboard className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExport('print')}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {generatedQuestions.map((question, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>Question {index + 1}</AccordionTrigger>
                        <AccordionContent>
                          {question}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {!isLoading && generatedQuestions.length === 0 && (
                 <Card className="flex items-center justify-center p-16 border-dashed">
                     <div className="text-center text-muted-foreground">
                         <Sparkles className="mx-auto h-12 w-12" />
                         <p className="mt-4">Your generated questions will appear here.</p>
                     </div>
                 </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
