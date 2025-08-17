# Data Studio

The Data Studio is a feature that allows users to view datasets and add records including annotations through a guided wizard interface.

## Features

1. **Dataset Viewing**: View existing records in a paginated table format
2. **Wizard-Based Data Entry**: Step-by-step process for adding new records
3. **Dynamic Forms**: Forms automatically generated based on DataModel schemas
4. **LLM Annotation Assistant**: Option to use AI assistance for annotations
5. **Validation**: Built-in form validation based on field types

## Wizard Steps

1. **Project & Data Models**: Select input and output data models
2. **Input Data**: Enter data according to the input DataModel schema
3. **Annotation Method**: Choose between manual entry or LLM assistance
4. **Annotation**: Enter annotation data according to the output DataModel schema
5. **Review & Save**: Review all data before saving to the dataset

## Components

- `DataStudioWizard`: Main wizard component that orchestrates the flow
- `WizardSteps`: Progress indicator for the wizard steps
- `DataEntryForm`: Dynamic form for input data entry
- `AnnotationForm`: Dynamic form for annotation data entry with LLM support
- `DatasetViewer`: Component to view existing records
- `useDataStudio`: Custom hook for managing wizard state

## Data Flow

1. User selects data models
2. User enters input data through dynamic form
3. User chooses annotation method (manual/LLM)
4. User enters/completes annotation
5. Data is saved to the local dataset (simulated in frontend)

## Implementation Details

- Uses the existing DataModel interfaces for dynamic form generation
- Implements form validation using Zod schemas
- Provides LLM annotation simulation for demonstration purposes
- Maintains all state in the frontend (no backend integration yet)
