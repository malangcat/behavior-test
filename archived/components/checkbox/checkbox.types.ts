export interface PrivateContext {}

export interface UserDefinedContext {
  id: string;
  getRootNode?: () => ShadowRoot | Document | Node;
  disabled?: boolean;
  readonly?: boolean;
  indeterminate?: boolean;
}

export interface Context extends PrivateContext, UserDefinedContext {}
