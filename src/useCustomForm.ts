import {
  useForm,
  UseFormReturn,
  FieldValues,
  UseFormProps,
  RegisterOptions,
  Path,
  UseFormRegister,
  UseFormHandleSubmit,
  //   SubmitHandler,
} from 'react-hook-form';

type ValidationRules<TFieldValues extends FieldValues = FieldValues> = {
  [K in keyof TFieldValues]: RegisterOptions<TFieldValues, Path<TFieldValues>>;
};

interface UseCustomFormProps<TFieldValues extends FieldValues = FieldValues>
  extends UseFormProps<TFieldValues> {
  onSubmit: UseFormHandleSubmit<TFieldValues>;
  //   onSubmit: SubmitHandler<TFieldValues>;
  validations?: ValidationRules<TFieldValues>;
}

function useCustomForm<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  validations = {} as ValidationRules<TFieldValues>,
  ...formProps
}: UseCustomFormProps<TFieldValues>): UseFormReturn<TFieldValues> {
  const methods = useForm<TFieldValues>(formProps);

  const customRegister: UseFormRegister<TFieldValues> = (
    name,
    options = {}
  ) => {
    const finalOptions = {
      ...options,
      ...(validations[name] ?? {}),
    };
    return methods.register(name, finalOptions);
  };

  //   const handleSubmit = methods.handleSubmit(onSubmit);
  const handleSubmit: UseFormHandleSubmit<TFieldValues> =
    methods.handleSubmit(onSubmit);

  return {
    ...methods,
    register: customRegister,
    handleSubmit,
  };
}

export default useCustomForm;
