import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/features/catalog/api/use-products";
import { formatPrice } from "@/lib/format";
import { Package, DollarSign, ShoppingCart, Users, Plus, Layout, Settings, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  createProductFn, 
  createCollectionFn, 
  initializeHomepageDataFn, 
  updateHomepageConfigFn,
  getAdminDashboardDataFn
} from "@/lib/shopify-admin";
import { getHomepageConfig, HomepageConfig } from "@/lib/shopify";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

const homepageSchema = z.object({
  hero: z.object({
    badge: z.string(),
    heading: z.string(),
    subheading: z.string(),
    videoUrl: z.string(),
    ctaPrimaryText: z.string(),
    ctaPrimaryLink: z.string(),
    ctaSecondaryText: z.string(),
    ctaSecondaryLink: z.string(),
  }),
  promos: z.array(z.object({
    id: z.number(),
    image: z.string(),
    title: z.string(),
    subtitle: z.string(),
    cta: z.string(),
    bgColor: z.string(),
  })),
  enrollPlan: z.object({
    title: z.string(),
    highlight: z.string(),
    description: z.string(),
    ctaText: z.string(),
  }),
});

function AdminPage() {
  const { data: products = [] } = useProducts();
  const queryClient = useQueryClient();
  
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  const { data: dashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: () => getAdminDashboardDataFn(),
  });

  const { data: config } = useQuery({
    queryKey: ["homepage-config"],
    queryFn: getHomepageConfig,
  });

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

  const homepageForm = useForm<z.infer<typeof homepageSchema>>({
    resolver: zodResolver(homepageSchema),
  });

  useEffect(() => {
    if (config) {
      homepageForm.reset(config);
    }
  }, [config, homepageForm]);

  const { fields: promoFields, append: appendPromo, remove: removePromo } = useFieldArray({
    control: homepageForm.control,
    name: "promos",
  });

  const initMutation = useMutation({
    mutationFn: initializeHomepageDataFn,
    onSuccess: () => {
      toast.success("Store initialized with mock data!");
      queryClient.invalidateQueries({ queryKey: ["homepage-config"] });
    },
    onError: (e) => toast.error("Failed to initialize: " + e.message),
  });

  const updateConfigMutation = useMutation({
    mutationFn: updateHomepageConfigFn,
    onSuccess: () => {
      toast.success("Homepage updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["homepage-config"] });
    },
    onError: (e) => toast.error("Update failed: " + e.message),
  });

  function onHomepageSubmit(values: z.infer<typeof homepageSchema>) {
    updateConfigMutation.mutate({ data: values as any });
  }

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
  });

  const createCollectionMutation = useMutation({
    mutationFn: createCollectionFn,
    onSuccess: (data) => {
      if (data.userErrors?.length > 0) {
        toast.error(data.userErrors[0].message);
      } else {
        toast.success("Collection created successfully");
        setIsCollectionDialogOpen(false);
      }
    },
  });

  const recentOrders = dashboardData?.orders || [];
  const totalSales = dashboardData?.totalSales || 0;
  const totalOrders = dashboardData?.totalOrders || 0;
  const totalCustomers = dashboardData?.totalCustomers || 0;

  return (
    <div className="pt-32 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-widest text-gold mb-2 uppercase font-bold">Store Admin</p>
          <h1 className="font-serif text-4xl">Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            className="text-xs font-bold uppercase tracking-widest"
            onClick={() => initMutation.mutate()}
            disabled={initMutation.isPending}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", initMutation.isPending && "animate-spin")} />
            {config ? "Reset to Defaults" : "Initialize Store"}
          </Button>

          <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-none border-gold text-gold hover:bg-gold hover:text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Collection</DialogTitle></DialogHeader>
              <Form {...productForm}>
                <form onSubmit={(e) => { e.preventDefault(); createCollectionMutation.mutate({ data: { title: "New Col" } }) }} className="space-y-4 pt-4">
                  <Input placeholder="Title" />
                  <Button type="submit">Create</Button>
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
              <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
              <Form {...productForm}>
                <form onSubmit={productForm.handleSubmit((v) => createProductMutation.mutate({ data: v }))} className="space-y-4 pt-4">
                  <FormField control={productForm.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={productForm.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <Button type="submit" className="w-full bg-gold" disabled={createProductMutation.isPending}>Create Product</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-secondary/50 p-1 rounded-none border border-border">
          <TabsTrigger value="overview" className="rounded-none px-8">Overview</TabsTrigger>
          <TabsTrigger value="homepage" className="rounded-none px-8">Homepage Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={DollarSign} label="Total Sales" value={formatPrice(totalSales)} />
            <Stat icon={ShoppingCart} label="Orders" value={String(totalOrders)} />
            <Stat icon={Package} label="Products" value={String(products.length)} />
            <Stat icon={Users} label="Customers" value={String(totalCustomers)} />
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <section>
              <h2 className="font-serif text-2xl mb-6">Recent Orders</h2>
              <div className="border border-border">
                <div className="grid grid-cols-4 px-4 py-3 text-[10px] tracking-widest text-muted-foreground border-b border-border uppercase font-bold">
                  <span>Order</span><span>Customer</span><span>Status</span><span className="text-right">Total</span>
                </div>
                {recentOrders.map((o) => (
                  <div key={o.id} className="grid grid-cols-4 px-4 py-4 text-sm border-b border-border last:border-b-0">
                    <span className="font-medium">{o.id}</span>
                    <span>{o.customer}</span>
                    <span className="text-xs text-gold tracking-widest uppercase font-bold">{o.status}</span>
                    <span className="text-right">{formatPrice(o.total)}</span>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground italic">No orders found.</div>
                )}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-6">Inventory</h2>
              <div className="border border-border divide-y divide-border h-[400px] overflow-y-auto">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4">
                    <img src={p.images?.[0] || ""} alt="" className="w-12 h-14 object-cover bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(p.price)} · Stock {p.stock || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="homepage" className="space-y-8">
          {!config && (
            <Card className="border-gold bg-gold/5">
              <CardHeader>
                <CardTitle className="text-gold">No configuration found</CardTitle>
                <CardDescription>Click "Initialize Store" to create the initial homepage layout.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {config && (
            <Form {...homepageForm}>
              <form onSubmit={homepageForm.handleSubmit(onHomepageSubmit)} className="space-y-12 pb-20">
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-serif">Hero Section</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                      <FormField control={homepageForm.control} name="hero.badge" render={({ field }) => (
                        <FormItem><FormLabel>Badge Text</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={homepageForm.control} name="hero.heading" render={({ field }) => (
                        <FormItem><FormLabel>Heading</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={homepageForm.control} name="hero.subheading" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Subheading</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={homepageForm.control} name="hero.videoUrl" render={({ field }) => (
                        <FormItem><FormLabel>Video URL (.webm)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <FormField control={homepageForm.control} name="hero.ctaPrimaryText" render={({ field }) => (
                          <FormItem><FormLabel>Primary CTA Text</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={homepageForm.control} name="hero.ctaPrimaryLink" render={({ field }) => (
                          <FormItem><FormLabel>Primary CTA Link</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <Separator />

                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Promo Carousel</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendPromo({ id: Date.now(), title: "New Promo", subtitle: "", image: "", cta: "Shop", bgColor: "bg-slate-100" })}>
                      + Add Slide
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {promoFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Slide #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removePromo(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control} name={`promos.${index}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                          )} />
                          <FormField control={homepageForm.control} name={`promos.${index}.image`} render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-serif">Enroll Plan Section</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                      <FormField control={homepageForm.control} name="enrollPlan.title" render={({ field }) => (
                        <FormItem><FormLabel>Plan Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={homepageForm.control} name="enrollPlan.highlight" render={({ field }) => (
                        <FormItem><FormLabel>Highlight Text (10+1)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                    </CardContent>
                  </Card>
                </section>

                <div className="fixed bottom-10 right-10 z-50">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="rounded-full shadow-2xl bg-noir hover:bg-gold px-12 py-8 text-cream font-bold uppercase tracking-widest text-sm"
                    disabled={updateConfigMutation.isPending}
                  >
                    {updateConfigMutation.isPending ? "Saving Changes..." : "Save Homepage Config"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="border border-border p-5 bg-white shadow-sm hover:border-gold transition-colors">
      <Icon className="h-4 w-4 text-gold mb-3" />
      <p className="text-xs tracking-widest text-muted-foreground uppercase font-bold">{label}</p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}


