export {
  Type,
  ArrayType,
  IntrinsicType,
  IntersectionType,
  ReferenceType,
  ReflectionType,
  StringLiteralType,
  TupleType,
  TypeOperatorType,
  TypeParameterType,
  UnionType,
  UnknownType,
} from 'typedoc/dist/lib/models';

export interface ReflectionData {
  name?: string;
  description?: string;
  content?: string;
}

export interface DeclarationData extends ReflectionData {
  type?: string;
  isOptional?: boolean;
}

export interface ParameterData extends DeclarationData {}

export interface SignatureData extends ReflectionData {
  returnType?: string;
  returnDesc?: string;
  params?: ParameterData[];
}
