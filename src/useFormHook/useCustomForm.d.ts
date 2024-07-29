import {
  UseFormReturn,
  FieldValues,
  UseFormProps,
  UseFormHandleSubmit,
} from 'react-hook-form';

type ValidationRules<TFieldValues extends FieldValues = FieldValues> = {
  [K in keyof TFieldValues]: RegisterOptions<TFieldValues, Path<TFieldValues>>;
};

interface UseCustomFormProps<TFieldValues extends FieldValues = FieldValues>
  extends UseFormProps<TFieldValues> {
  onSubmit: UseFormHandleSubmit<TFieldValues>;
  validations?: ValidationRules<TFieldValues>;
}

declare function useCustomForm<TFieldValues extends FieldValues = FieldValues>(
  props: UseCustomFormProps<TFieldValues>
): UseFormReturn<TFieldValues>;

export default useCustomForm;
