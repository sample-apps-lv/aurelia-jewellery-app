import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/features/catalog/api/use-products";
import { formatPrice } from "@/lib/format";
import { Package, DollarSign, ShoppingCart, Users, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProductFn, createCollectionFn } from "@/lib/shopify-admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Gajanand Jewellers" }] }),
  component: AdminPage,
});

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  descriptionHtml: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  vendor: z.string().optional(),
  productType: z.string().optional(),
});

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  descriptionHtml: z.string().optional(),
});

const RECENT_ORDERS = [
  { id: "GJ-78421", customer: "E. Vance", date: "Mar 12", total: 489000, status: "Delivered" },
  { id: "GJ-78420", customer: "M. Laurent", date: "Mar 11", total: 219000, status: "Shipped" },
  { id: "GJ-78419", customer: "S. Romano", date: "Mar 10", total: 689000, status: "Processing" },
  { id: "GJ-78418", customer: "J. Park", date: "Mar 09", total: 129000, status: "Delivered" },
];

function AdminPage() {
  const { data: products = [] } = useProducts();
  const queryClient = useQueryClient();
  const totalSales = RECENT_ORDERS.reduce((s, o) => s + o.total, 0);
  
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      descriptionHtml: "",
      price: "",
      vendor: "Gajanand Jewellers",
      productType: "",
    },
  });

  const collectionForm = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      descriptionHtml: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: createProductFn,
    onSuccess: (data) => {
      if (data.userErrors?.length > 0) {
        toast.error(data.userErrors[0].message);
      } else {
        toast.success("Product created successfully");
        setIsProductDialogOpen(false);
        productForm.reset();
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const createCollectionMutation = useMutation({
    mutationFn: createCollectionFn,
    onSuccess: (data) => {
      if (data.userErrors?.length > 0) {
        toast.error(data.userErrors[0].message);
      } else {
        toast.success("Collection created successfully");
        setIsCollectionDialogOpen(false);
        collectionForm.reset();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create collection");
    },
  });

  function onProductSubmit(values: z.infer<typeof productSchema>) {
    createProductMutation.mutate({ data: values });
  }

  function onCollectionSubmit(values: z.infer<typeof collectionSchema>) {
    createCollectionMutation.mutate({ data: values });
  }

  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest text-gold mb-2 uppercase font-bold">Store Admin</p>
          <h1 className="font-serif text-4xl">Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-none border-gold text-gold hover:bg-gold hover:text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <Form {...collectionForm}>
                <form onSubmit={collectionForm.handleSubmit(onCollectionSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={collectionForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Bridal Collection" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={collectionForm.control}
                    name="descriptionHtml"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your collection..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold-light"
                    disabled={createCollectionMutation.isPending}
                  >
                    {createCollectionMutation.isPending ? "Creating..." : "Create Collection"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-none bg-gold hover:bg-gold-light">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <Form {...productForm}>
                <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={productForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Diamond Necklace" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={productForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (INR)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="45000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={productForm.control}
                      name="productType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category/Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Necklace" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={productForm.control}
                    name="descriptionHtml"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Product details..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold-light"
                    disabled={createProductMutation.isPending}
                  >
                    {createProductMutation.isPending ? "Creating..." : "Create Product"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Stat icon={DollarSign} label="Total Sales" value={formatPrice(totalSales)} />
        <Stat icon={ShoppingCart} label="Orders" value={String(RECENT_ORDERS.length)} />
        <Stat icon={Package} label="Products" value={String(products.length)} />
        <Stat icon={Users} label="Customers" value="248" />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="font-serif text-2xl mb-6">Recent Orders</h2>
          <div className="border border-border">
            <div className="grid grid-cols-4 px-4 py-3 text-[10px] tracking-widest text-muted-foreground border-b border-border uppercase font-bold">
              <span>Order</span><span>Customer</span><span>Status</span><span className="text-right">Total</span>
            </div>
            {RECENT_ORDERS.map((o) => (
              <div key={o.id} className="grid grid-cols-4 px-4 py-4 text-sm border-b border-border last:border-b-0">
                <span className="font-medium">{o.id}</span>
                <span>{o.customer}</span>
                <span className="text-xs text-gold tracking-widest uppercase font-bold">{o.status}</span>
                <span className="text-right">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl">Inventory</h2>
          </div>
          <div className="border border-border divide-y divide-border h-[400px] overflow-y-auto">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <img src={p.images?.[0] || ""} alt="" className="w-12 h-14 object-cover bg-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(p.price)} · Stock {p.stock || 0}</p>
                </div>
                <button className="text-xs tracking-widest text-muted-foreground hover:text-gold uppercase font-bold">Edit</button>
              </div>
            ))}
            {products.length === 0 && (
              <div className="p-8 text-center text-muted-foreground italic">
                No products found in inventory.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="border border-border p-5">
      <Icon className="h-4 w-4 text-gold mb-3" />
      <p className="text-xs tracking-widest text-muted-foreground uppercase font-bold">{label}</p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}

