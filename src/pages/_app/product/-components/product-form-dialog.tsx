import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { 
  createProduct, 
  updateProduct, 
  fetchProductCategories, 
  fetchProductBrands, 
  type CreateProductRequestDTO,
  type Product 
} from "@/api/product";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit?: Product;
}

export function ProductFormDialog({ open, onOpenChange, productToEdit }: ProductFormDialogProps) {
  const queryClient = useQueryClient();
  
  const { data: categories = [] } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchProductCategories,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["product-brands"],
    queryFn: fetchProductBrands,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
  });

  const isEditing = !!productToEdit;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload: CreateProductRequestDTO = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      categoryId: Number(formData.get("categoryId")),
      brandId: formData.get("brandId") ? Number(formData.get("brandId")) : undefined,
      min_stock: Number(formData.get("minStock")) || undefined,
    };

    if (isEditing) {
      updateMutation.mutate({ ...payload, id: productToEdit.id });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Editar Produto" : "Cadastro de Produtos"}
          </DialogTitle>
        </DialogHeader>
        <form id="product-form" key={productToEdit?.id || "new"} onSubmit={handleSubmit}>
          <div className="grid gap-6 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input id="nome" name="name" defaultValue={productToEdit?.name} placeholder="Digite o nome do produto" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="codigo">Código Interno do Produto</Label>
                <Input id="codigo" name="code" defaultValue={productToEdit?.code} placeholder="Digite o código interno do produto" required />
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <div className="flex flex-col gap-2">
                <Label>Categoria</Label>
                <Select name="categoryId" defaultValue={productToEdit?.category?.id?.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Marca</Label>
                <Select name="brandId" defaultValue={productToEdit?.brand?.id?.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 pb-2">
                <Label className="mb-1">Ativo</Label>
                <Switch name="active" defaultChecked={productToEdit ? !productToEdit.deleted_at : true} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Unidade de Medida</Label>
                <Select name="unitOfMeasure" defaultValue={productToEdit?.unitOfMeasure}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un1">Unidade 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="estoqueMin">Estoque Mínimo</Label>
                <Input id="estoqueMin" name="minStock" defaultValue={productToEdit?.min_stock} type="number" placeholder="Mínimo" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="estoqueMax">Estoque Máximo</Label>
                <Input id="estoqueMax" name="maxStock" defaultValue={productToEdit?.maxStock} type="number" placeholder="Máximo" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao">Descrição Produto</Label>
              <Textarea
                id="descricao"
                name="description"
                defaultValue={productToEdit?.description}
                placeholder="Descreva o produto"
                className="h-24 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="anotacoes">Anotações Internas</Label>
              <Textarea
                id="anotacoes"
                name="internalNotes"
                defaultValue={productToEdit?.internalNotes}
                placeholder="Crie anotações internas"
                className="h-24 resize-none"
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" form="product-form" disabled={isPending}>
            {isPending ? "Salvando..." : (isEditing ? "Salvar alterações" : "Adicionar produto")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
