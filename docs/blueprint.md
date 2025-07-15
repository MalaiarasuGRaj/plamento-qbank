# **App Name**: SkillScout

## Core Features:

- Resume Upload: Enable users to upload their resume in PDF or DOCX format.
- Resume Parsing: Parse and extract skills and job role from the uploaded resume using basic NLP (or placeholder logic for MVP).
- Skill Selection: Provide a text field for comma-separated input of skills. Pre-fill this field based on extracted data from the resume (e.g., Python, SQL, Excel, Machine Learning).
- Question Format Selection: Offer radio buttons or a dropdown menu to select the question format (MCQs, Fill in the Blanks, Theoretical).
- Question Generation: Generate domain-specific questions tailored to the uploaded resume and selected skills. An LLM is used as a tool to determine which questions are most relevant.
- Question Display: Display the generated questions to the user in the selected format.
- Export Questions: Allow users to save/export the generated questions, with or without answers (if applicable).

## Style Guidelines:

- Primary color: Dark blue (#1A202C) for the background, providing a dark mode experience.
- Secondary color: Light gray (#E2E8F0) for text, ensuring readability against the dark background.
- Accent color: Teal (#4DC0B5) to highlight interactive elements and call-to-actions.
- Body and headline font: 'Roboto', a sans-serif font known for its legibility and modern appearance, suitable for dark mode interfaces.
- A clean and intuitive layout optimized for dark mode. The resume upload section should be prominently displayed, followed by skill selection and question format options. Generated questions should be clearly separated from the input fields with sufficient contrast.
- Subtle, non-distracting animations when the system is loading questions or processing a resume. Animations should be optimized for dark mode to avoid causing eye strain.