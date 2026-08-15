/**
 * Read shape (as returned inside UserDetailSerializer.informations). The
 * exact field list of `InformationSerializer` (the read-only variant)
 * wasn't included in what you shared, so `id`/`parent`/recursive
 * `children` are inferred from the model relationship described by
 * InformationCreateSerializer + Information.parent usage — adjust if the
 * real serializer differs.
 */
export interface InformationRead {
  id: number;
  title: string;
  text: string;
  file: string | null;
  children: InformationRead[];
}

/**
 * Write shape (create/update), mirrors InformationCreateSerializer exactly:
 * title, text, file, children — where `children` is a plain list of dicts
 * recursively re-validated through the same serializer, so this type is
 * self-recursive too. This is the "many" nested structure — any node can
 * carry any number of child nodes, each of which can carry more children.
 */
export interface InformationInput {
  title: string;
  text?: string;
  /** A newly-picked File to upload, or omitted/undefined to leave unset. */
  file?: File | null;
  children?: InformationInput[];
}
