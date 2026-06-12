import { createFileRoute, Link, useParams, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useProducts } from "@/features/catalog/api/use-products";
import { formatPrice } from "@/lib/format";
import { Package, DollarSign, ShoppingCart, Users, Plus, Layout, Settings, RefreshCw, ArrowLeft } from "lucide-react";
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
import { VideoUploader } from "@/components/sections/video-uploader";

export const Route = createFileRoute("/admin/$")({
  head: () => ({ meta: [{ title: "Admin — Gajanand Jewellers" }] }),
  component: AdminPage,
});

const sidebarNav = [
  {
    title: "Overview",
    href: "overview",
    id: "overview",
    icon: Layout,
    subItems: [
      { title: "Dashboard Stats", target: "stats" },
      { title: "Recent Orders", target: "orders" },
      { title: "Inventory", target: "inventory" }
    ]
  },
  {
    title: "Homepage Editor",
    href: "homepage",
    id: "homepage",
    icon: Layout,
    subItems: [
      { title: "Hero Section", target: "hero" },
      { title: "Promo Carousel", target: "promo" },
      { title: "Enroll Plan", target: "enroll" },
      { title: "Promises", target: "promises" },
      { title: "Category Grid", target: "category-grid" },
      { title: "Gift Categories", target: "gift-categories" },
      { title: "Gift Points", target: "gift-points" },
      { title: "Collections", target: "collections" },
      { title: "Trust Bar", target: "trust-bar" },
      { title: "Shop By Price", target: "shop-by-price" },
      { title: "Social Proof", target: "social-proof" }
    ]
  },
  {
    title: "Header Editor",
    href: "header",
    id: "header",
    icon: Settings,
    subItems: [
      { title: "Header Identity", target: "header-identity" },
      { title: "Left Navigation", target: "left-nav" },
      { title: "Right Navigation", target: "right-nav" }
    ]
  }
];

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
  header: z.object({
    logoText: z.string().min(1, "Required"),
    searchPlaceholder: z.string().min(1, "Required"),
    findStoreLabel: z.string().min(1, "Required"),
    wishlistLabel: z.string().min(1, "Required"),
    cartLabel: z.string().min(1, "Required"),
    profileLabel: z.string().min(1, "Required"),
    moreLabel: z.string().min(1, "Required"),
    navLeft: z.array(z.object({
      label: z.string().min(1, "Required"),
      category: z.string().min(1, "Required"),
      subItems: z.array(z.object({
        label: z.string().min(1, "Required"),
        url: z.string().min(1, "Required"),
      })).optional(),
      type: z.enum(["mega"]).optional(),
      columns: z.array(z.object({
        title: z.string().min(1, "Required"),
        image: z.string().min(1, "Required"),
        buttonText: z.string().min(1, "Required"),
        linkText: z.string().min(1, "Required"),
      })).optional(),
      education: z.object({
        title: z.string().min(1, "Required"),
        items: z.array(z.object({
          label: z.string(),
          icon: z.string(),
          color: z.string(),
        })),
      }).optional(),
    })),
    navRight: z.array(z.object({
      label: z.string().min(1, "Required"),
      category: z.string().min(1, "Required"),
      subItems: z.array(z.object({
        label: z.string().min(1, "Required"),
        url: z.string().min(1, "Required"),
      })).optional(),
    })),
  }),
  hero: z.object({
    badge: z.string().min(1, "Required"),
    heading: z.string().min(1, "Required"),
    subheading: z.string().min(1, "Required"),
    videoUrl: z.string().min(1, "Required"),
    ctaPrimaryText: z.string().min(1, "Required"),
    ctaPrimaryLink: z.string().min(1, "Required"),
  }),
  promos: z.array(z.object({
    id: z.number(),
    image: z.string().min(1, "Required"),
    title: z.string().min(1, "Required"),
    subtitle: z.string().optional(),
    cta: z.string().min(1, "Required"),
    bgColor: z.string().min(1, "Required"),
  })),
  enrollPlan: z.object({
    title: z.string().min(1, "Required"),
    highlight: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    ctaText: z.string().min(1, "Required"),
  }),
  promises: z.array(z.object({
    title: z.string().min(1, "Required"),
    desc: z.string().min(1, "Required"),
    icon: z.string().min(1, "Required"),
  })).default([]),
  giftSection: z.object({
    categories: z.array(z.object({
      title: z.string().min(1, "Required"),
      description: z.string().min(1, "Required"),
      image: z.string().min(1, "Required"),
      to: z.string().min(1, "Required"),
    })).default([]),
    giftPoints: z.array(z.object({
      label: z.string().min(1, "Required"),
      price: z.string().min(1, "Required"),
      to: z.string().min(1, "Required"),
    })).default([]),
  }).default({ categories: [], giftPoints: [] }),
  categoryGrid: z.array(z.object({
    title: z.string().min(1, "Required"),
    image: z.string().min(1, "Required"),
    to: z.string().min(1, "Required"),
  })).default([]),
  collections: z.array(z.object({
    title: z.string().min(1, "Required"),
    subtitle: z.string().optional(),
    image: z.string().min(1, "Required"),
    to: z.string().min(1, "Required"),
  })).default([]),
  trustBar: z.array(z.object({
    icon: z.string().min(1, "Required"),
    label: z.string().min(1, "Required"),
  })).default([]),
  shopByPrice: z.array(z.object({
    label: z.string().min(1, "Required"),
    to: z.string().min(1, "Required"),
  })).default([]),
  socialProof: z.object({
    heading: z.string().min(1, "Required"),
    subheading: z.string().optional(),
    images: z.array(z.string()).optional(),
  }).default({ heading: "" }),
  footer: z.object({
    links: z.any().optional(),
    social: z.any().optional(),
    newsletter: z.any().optional(),
  }).default({}),
});

function AdminPage() {
  const { _splat } = useParams({ strict: false });
  const currentTab = _splat || 'overview';

  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (location.hash) {
      setActiveSection(location.hash.replace('#', ''));
    }
  }, [location.hash]);

  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const activeNav = sidebarNav.find(n => n.id === currentTab);
      if (!activeNav) return;
      
      const sections = activeNav.subItems
        .map(s => document.getElementById(s.target))
        .filter(Boolean) as HTMLElement[];
        
      let current = "";
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 300) {
          current = section.id;
        }
      }
      
      if (current && current !== activeSection) {
        setActiveSection(current);
        window.history.replaceState(null, '', `#${current}`);
      }
    };
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [currentTab, activeSection]);

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
    resolver: zodResolver(homepageSchema as any) as any,
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

  const { fields: navLeftFields, append: appendNavLeft, remove: removeNavLeft } = useFieldArray({
    control: homepageForm.control,
    name: "header.navLeft",
  });

  const { fields: navRightFields, append: appendNavRight, remove: removeNavRight } = useFieldArray({
    control: homepageForm.control,
    name: "header.navRight",
  });

  const { fields: promisesFields, append: appendPromise, remove: removePromise } = useFieldArray({
    control: homepageForm.control,
    name: "promises" as any,
  });

  const { fields: giftCategoryFields, append: appendGiftCategory, remove: removeGiftCategory } = useFieldArray({
    control: homepageForm.control,
    name: "giftSection.categories" as any,
  });

  const { fields: giftPointFields, append: appendGiftPoint, remove: removeGiftPoint } = useFieldArray({
    control: homepageForm.control,
    name: "giftSection.giftPoints" as any,
  });

  const { fields: categoryGridFields, append: appendCategoryGrid, remove: removeCategoryGrid } = useFieldArray({
    control: homepageForm.control as any,
    name: "categoryGrid" as any,
  });

  const { fields: collectionFields, append: appendCollection, remove: removeCollection } = useFieldArray({
    control: homepageForm.control,
    name: "collections" as any,
  });

  const { fields: trustBarFields, append: appendTrustBar, remove: removeTrustBar } = useFieldArray({
    control: homepageForm.control,
    name: "trustBar" as any,
  });

  const { fields: shopByPriceFields, append: appendShopByPrice, remove: removeShopByPrice } = useFieldArray({
    control: homepageForm.control,
    name: "shopByPrice" as any,
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

  function onHomepageError(errors: any) {
    console.error("Homepage form errors:", errors);
    toast.error("Please fix the errors in the form before saving.");
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

  const SubItemsEditor = ({ parentIndex, name }: { parentIndex: number, name: "header.navLeft" | "header.navRight" }) => {
    const { fields, append, remove } = useFieldArray({
      control: homepageForm.control,
      name: `${name}.${parentIndex}.subItems` as any,
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Sub-items</p>
          <Button type="button" variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => append({ label: "", url: "" })}>+ Add Sub-item</Button>
        </div>
        <div className="grid gap-2">
          {fields.map((sub, subIdx) => (
            <div key={sub.id} className="flex gap-2 items-start">
              <FormField control={homepageForm.control as any} name={`${name}.${parentIndex}.subItems.${subIdx}.label` as any} render={({ field }) => (
                <FormItem className="flex-1"><FormControl><Input {...field} placeholder="Label" className="h-8 text-xs" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={homepageForm.control as any} name={`${name}.${parentIndex}.subItems.${subIdx}.url` as any} render={({ field }) => (
                <FormItem className="flex-1"><FormControl><Input {...field} placeholder="URL" className="h-8 text-xs" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button variant="ghost" size="sm" className="h-8 w-8 text-destructive" onClick={() => remove(subIdx)}>×</Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider className="flex flex-col h-screen w-full overflow-hidden">

      {/* header */}
      <div className="flex-none pt-6 pb-4 px-6 lg:px-10 bg-background z-10 border-b border-border shadow-sm">
        <div className="mb-4">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center w-fit transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div>
              <p className="text-[10px] tracking-widest text-gold mb-1 uppercase font-bold">Store Admin</p>
              <h1 className="font-serif text-3xl">Dashboard</h1>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="text-xs font-bold uppercase tracking-widest"
              onClick={() => initMutation.mutate({ data: undefined as any })}
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
                      <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={productForm.control} name="price" render={({ field }) => (
                      <FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-gold" disabled={createProductMutation.isPending}>Create Product</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden px-6 lg:px-10 py-6 gap-6">
        {/* Desktop Sidebar (inline) */}
        <Sidebar collapsible="none" className="hidden lg:flex flex-shrink-0 w-60 h-full overflow-y-auto bg-transparent border-none">
          <SidebarContent className="p-0">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarNav.map((nav) => {
                    const isActive = currentTab === nav.id;
                    return (
                      <SidebarMenuItem key={nav.id} className="mb-2">
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className={cn(
                            "px-4 py-5 rounded-none font-medium transition-colors border-l-2 h-auto hover:bg-secondary/50",
                            isActive ? "bg-gold/10 text-gold border-gold hover:text-gold hover:bg-gold/20" : "border-transparent text-muted-foreground"
                          )}
                        >
                          <Link to="/admin/$" params={{ _splat: nav.href }}>
                            <nav.icon className="w-4 h-4 mr-2" />
                            <span className="font-serif tracking-wide text-base">{nav.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {isActive && nav.subItems.length > 0 && (
                          <SidebarMenuSub className="ml-5 mt-2 border-l-border">
                            {nav.subItems.map(sub => {
                              const isSubActive = activeSection === sub.target;
                              return (
                                <SidebarMenuSubItem key={sub.target}>
                                  <SidebarMenuSubButton asChild>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.getElementById(sub.target);
                                        const container = document.getElementById('main-scroll-container');
                                        if (el && container) {
                                          const y = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 40;
                                          container.scrollTo({ top: y, behavior: 'smooth' });
                                          window.history.pushState(null, '', `#${sub.target}`);
                                          setActiveSection(sub.target);
                                        }
                                      }}
                                      className={cn("text-xs font-medium tracking-wide uppercase transition-colors h-auto py-2", isSubActive ? "text-gold" : "text-muted-foreground hover:text-gold")}
                                    >
                                      {sub.title}
                                    </button>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar className="lg:hidden">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarNav.map((nav) => {
                      const isActive = currentTab === nav.id;
                      return (
                        <SidebarMenuItem key={nav.id}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive}
                            className={cn(
                              "px-4 py-5 h-auto",
                              isActive && "text-gold"
                            )}
                          >
                            <Link to="/admin/$" params={{ _splat: nav.href }}>
                              <nav.icon className="w-4 h-4 mr-2" />
                              <span className="font-serif text-lg">{nav.title}</span>
                            </Link>
                          </SidebarMenuButton>
                          {isActive && nav.subItems.length > 0 && (
                            <SidebarMenuSub>
                              {nav.subItems.map(sub => {
                                const isSubActive = activeSection === sub.target;
                                return (
                                  <SidebarMenuSubItem key={sub.target}>
                                    <SidebarMenuSubButton asChild>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const el = document.getElementById(sub.target);
                                          const container = document.getElementById('main-scroll-container');
                                          if (el && container) {
                                            const y = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 40;
                                            container.scrollTo({ top: y, behavior: 'smooth' });
                                            window.history.pushState(null, '', `#${sub.target}`);
                                            setActiveSection(sub.target);
                                          }
                                        }}
                                        className={cn("text-sm py-2", isSubActive ? "text-gold" : "hover:text-gold")}
                                      >
                                        {sub.title}
                                      </button>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
        
        {/* section content */}
        <main id="main-scroll-container" className="flex-1 w-full overflow-y-auto border border-border p-6 shadow-sm rounded-md custom-scrollbar relative ">
          {currentTab === 'overview' && (
            <div className="space-y-12">
              <div id="stats" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-m-32">
            <Stat icon={DollarSign} label="Total Sales" value={formatPrice(totalSales)} />
            <Stat icon={ShoppingCart} label="Orders" value={String(totalOrders)} />
            <Stat icon={Package} label="Products" value={String(products.length)} />
            <Stat icon={Users} label="Customers" value={String(totalCustomers)} />
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <section id="orders" className="scroll-m-32 pt-4">
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

            <section id="inventory" className="scroll-m-32 pt-4">
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
            </div>
          )}

          {currentTab === 'header' && (
            <div className="space-y-8">
              <Form {...homepageForm}>
                <form onSubmit={homepageForm.handleSubmit(onHomepageSubmit as any, onHomepageError)} className="space-y-12 pb-20">
                  <section id="header-identity" className="space-y-6 scroll-m-32 pt-4">
                    <div className="flex items-center gap-2">
                      <Layout className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Header Identity & Actions</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={homepageForm.control as any} name="header.logoText" render={({ field }) => (
                      <FormItem><FormLabel>Logo Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={homepageForm.control as any} name="header.searchPlaceholder" render={({ field }) => (
                      <FormItem><FormLabel>Search Placeholder</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={homepageForm.control as any} name="header.findStoreLabel" render={({ field }) => (
                      <FormItem><FormLabel>Find Store Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={homepageForm.control as any} name="header.wishlistLabel" render={({ field }) => (
                      <FormItem><FormLabel>Wishlist Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={homepageForm.control as any} name="header.cartLabel" render={({ field }) => (
                      <FormItem><FormLabel>Cart Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={homepageForm.control as any} name="header.profileLabel" render={({ field }) => (
                      <FormItem><FormLabel>Profile Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={homepageForm.control as any} name="header.moreLabel" render={({ field }) => (
                      <FormItem><FormLabel>More Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                </Card>
              </section>

              <Separator />

              <section id="left-nav" className="space-y-6 scroll-m-32 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-serif">Left Navigation</h2>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendNavLeft({ label: "New Item", category: "all", subItems: [] })}>
                    + Add Item
                  </Button>
                </div>
                <div className="grid gap-6">
                  {navLeftFields.map((field, index) => (
                    <Card key={field.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nav Item #{index + 1}</CardTitle>
                        <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeNavLeft(index)}>×</Button>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-3 gap-4">
                        <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.label`} render={({ field }) => (
                          <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.category`} render={({ field }) => (
                          <FormItem><FormLabel>Category Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.type`} render={({ field }) => (
                          <FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} placeholder="mega or leave empty" /></FormControl><FormMessage /></FormItem>
                        )} />
                      </CardContent>
                      {homepageForm.watch(`header.navLeft.${index}.type`) === "mega" && (
                        <CardContent className="border-t pt-4 space-y-6">
                          <div className="space-y-4">
                            <p className="text-xs uppercase tracking-widest text-gold font-bold">Mega Menu Columns</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[0, 1, 2].map((colIdx) => (
                                <div key={colIdx} className="space-y-2 p-3 border border-border rounded-sm">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Column {colIdx + 1}</p>
                                  <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.columns.${colIdx}.title`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl><Input {...field} placeholder="Title" className="h-8 text-xs" /></FormControl><FormMessage />
                                    </FormItem>
                                  )} />
                                  <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.columns.${colIdx}.image`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl><Input {...field} placeholder="Image URL" className="h-8 text-xs" /></FormControl><FormMessage />
                                    </FormItem>
                                  )} />
                                  <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.columns.${colIdx}.buttonText`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl><Input {...field} placeholder="Button Text" className="h-8 text-xs" /></FormControl><FormMessage />
                                    </FormItem>
                                  )} />
                                  <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.columns.${colIdx}.linkText`} render={({ field }) => (
                                    <FormItem>
                                      <FormControl><Input {...field} placeholder="Link Text" className="h-8 text-xs" /></FormControl><FormMessage />
                                    </FormItem>
                                  )} />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-xs uppercase tracking-widest text-gold font-bold">Education Guide</p>
                            <Card className="bg-secondary/20 border-none rounded-none">
                              <CardContent className="pt-4 space-y-4">
                                <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.education.title`} render={({ field }) => (
                                  <FormItem>
                                    <FormControl><Input {...field} placeholder="Guide Title (e.g. Diamond Education)" className="h-8 text-xs font-bold" /></FormControl><FormMessage />
                                  </FormItem>
                                )} />
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                                  {[0, 1, 2, 3, 4, 5].map((eduIdx) => (
                                    <div key={eduIdx} className="space-y-1">
                                      <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.education.items.${eduIdx}.label`} render={({ field }) => (
                                        <FormItem>
                                          <FormControl><Input {...field} placeholder="Label" className="h-7 text-[10px]" /></FormControl><FormMessage />
                                        </FormItem>
                                      )} />
                                      <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.education.items.${eduIdx}.icon`} render={({ field }) => (
                                        <FormItem>
                                          <FormControl><Input {...field} placeholder="Icon" className="h-7 text-[10px]" /></FormControl><FormMessage />
                                        </FormItem>
                                      )} />
                                      <FormField control={homepageForm.control as any} name={`header.navLeft.${index}.education.items.${eduIdx}.color`} render={({ field }) => (
                                        <FormItem>
                                          <FormControl><Input {...field} placeholder="Color" className="h-7 text-[10px]" /></FormControl><FormMessage />
                                        </FormItem>
                                      )} />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      )}
                      
                      {!homepageForm.watch(`header.navLeft.${index}.type`) && (
                        <CardContent className="border-t pt-4">
                          <SubItemsEditor parentIndex={index} name="header.navLeft" />
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </section>

              <Separator />

              <section id="right-nav" className="space-y-6 scroll-m-32 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-serif">Right Navigation</h2>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendNavRight({ label: "New Item", category: "all", subItems: [] })}>
                    + Add Item
                  </Button>
                </div>
                <div className="grid gap-6">
                  {navRightFields.map((field, index) => (
                    <Card key={field.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nav Item #{index + 1}</CardTitle>
                        <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeNavRight(index)}>×</Button>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-4">
                        <FormField control={homepageForm.control as any} name={`header.navRight.${index}.label`} render={({ field }) => (
                          <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={homepageForm.control as any} name={`header.navRight.${index}.category`} render={({ field }) => (
                          <FormItem><FormLabel>Category Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </CardContent>
                      <CardContent className="border-t pt-4">
                        <SubItemsEditor parentIndex={index} name="header.navRight" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <div className="fixed bottom-10 right-10 z-50">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-full shadow-2xl bg-noir hover:bg-gold px-12 py-8 text-cream font-bold uppercase tracking-widest text-sm"
                  disabled={updateConfigMutation.isPending}
                >
                  {updateConfigMutation.isPending ? "Saving Changes..." : "Save Header Config"}
                </Button>
                </div>
              </form>
            </Form>
          </div>
          )}

          {currentTab === 'homepage' && (
            <div className="space-y-8">
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
              <form onSubmit={homepageForm.handleSubmit(onHomepageSubmit as any, onHomepageError)} className="space-y-12 pb-20">
                <section id="hero" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-serif">Hero Section</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                      <FormField control={homepageForm.control as any} name="hero.badge" render={({ field }) => (
                        <FormItem><FormLabel>Badge Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={homepageForm.control as any} name="hero.heading" render={({ field }) => (
                        <FormItem><FormLabel>Heading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={homepageForm.control as any} name="hero.subheading" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Subheading</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={homepageForm.control as any} name="hero.videoUrl" render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Hero Video</FormLabel>
                          <VideoUploader value={field.value} onChange={field.onChange} />
                          <FormMessage />
                          <FormDescription>Upload a .webm, .mp4, or .mov file (max 1GB) or enter a URL.</FormDescription>
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <FormField control={homepageForm.control as any} name="hero.ctaPrimaryText" render={({ field }) => (
                          <FormItem><FormLabel>Primary CTA Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={homepageForm.control as any} name="hero.ctaPrimaryLink" render={({ field }) => (
                          <FormItem><FormLabel>Primary CTA Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <Separator />

                <section id="promo" className="space-y-6 scroll-m-32 pt-4">
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
                          <FormField control={homepageForm.control as any} name={`promos.${index}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`promos.${index}.image`} render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={homepageForm.control as any} name={`promos.${index}.cta`} render={({ field }) => (
                              <FormItem><FormLabel>CTA Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={homepageForm.control as any} name={`promos.${index}.bgColor`} render={({ field }) => (
                              <FormItem><FormLabel>Background Color</FormLabel><FormControl><Input {...field} placeholder="e.g. bg-slate-100" /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                <section id="enroll" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-serif">Enroll Plan Section</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                      <FormField control={homepageForm.control as any} name="enrollPlan.title" render={({ field }) => (
                        <FormItem><FormLabel>Plan Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={homepageForm.control as any} name="enrollPlan.highlight" render={({ field }) => (
                        <FormItem><FormLabel>Highlight Text (10+1)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={homepageForm.control as any} name="enrollPlan.description" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={homepageForm.control as any} name="enrollPlan.ctaText" render={({ field }) => (
                        <FormItem><FormLabel>CTA Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </CardContent>
                  </Card>
                </section>

                <Separator />

                {/* Promises */}
                <section id="promises" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Promises</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendPromise({ title: "New Promise", desc: "", icon: "" })}>
                      + Add Promise
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {promisesFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Promise #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removePromise(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control as any} name={`promises.${index}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`promises.${index}.desc`} render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`promises.${index}.icon`} render={({ field }) => (
                            <FormItem><FormLabel>Icon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Category Grid */}
                <section id="category-grid" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layout className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Category Grid</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendCategoryGrid({ title: "New Category", image: "", to: "" })}>
                      + Add Category
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryGridFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Category #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeCategoryGrid(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control as any} name={`categoryGrid.${index}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`categoryGrid.${index}.image`} render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`categoryGrid.${index}.to`} render={({ field }) => (
                            <FormItem><FormLabel>Link To</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Gift Categories */}
                <section id="gift-categories" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Gift Categories</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendGiftCategory({ title: "New Category", description: "", image: "", to: "" })}>
                      + Add Category
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {giftCategoryFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Category #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeGiftCategory(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control as any} name={`giftSection.categories.${index}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`giftSection.categories.${index}.description`} render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`giftSection.categories.${index}.image`} render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`giftSection.categories.${index}.to`} render={({ field }) => (
                            <FormItem><FormLabel>Link To</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Gift Points */}
                <section id="gift-points" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Gift Points</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendGiftPoint({ label: "New Point", price: "", to: "" })}>
                      + Add Gift Point
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {giftPointFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Gift Point #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeGiftPoint(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control as any} name={`giftSection.giftPoints.${index}.label`} render={({ field }) => (
                            <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`giftSection.giftPoints.${index}.price`} render={({ field }) => (
                            <FormItem><FormLabel>Price</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`giftSection.giftPoints.${index}.to`} render={({ field }) => (
                            <FormItem><FormLabel>Link To</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Collections */}
                <section id="collections" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Collections</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendCollection({ title: "New Collection", subtitle: "", image: "", to: "" })}>
                      + Add Collection
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {collectionFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Collection #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeCollection(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control as any} name={`collections.${index}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`collections.${index}.subtitle`} render={({ field }) => (
                            <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`collections.${index}.image`} render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`collections.${index}.to`} render={({ field }) => (
                            <FormItem><FormLabel>Link To</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Trust Bar */}
                <section id="trust-bar" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Trust Bar</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendTrustBar({ icon: "", label: "New Trust Bar Item" })}>
                      + Add Trust Item
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {trustBarFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Trust Item #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeTrustBar(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control as any} name={`trustBar.${index}.icon`} render={({ field }) => (
                            <FormItem><FormLabel>Icon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`trustBar.${index}.label`} render={({ field }) => (
                            <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Shop By Price */}
                <section id="shop-by-price" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gold" />
                      <h2 className="text-2xl font-serif">Shop By Price</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendShopByPrice({ label: "New Price Range", to: "" })}>
                      + Add Price Range
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {shopByPriceFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Price Range #{index + 1}</CardTitle>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => removeShopByPrice(index)}>×</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField control={homepageForm.control as any} name={`shopByPrice.${index}.label`} render={({ field }) => (
                            <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={homepageForm.control as any} name={`shopByPrice.${index}.to`} render={({ field }) => (
                            <FormItem><FormLabel>Link To</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <Separator />

                {/* Social Proof */}
                <section id="social-proof" className="space-y-6 scroll-m-32 pt-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gold" />
                    <h2 className="text-2xl font-serif">Social Proof</h2>
                  </div>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <FormField control={homepageForm.control as any} name="socialProof.heading" render={({ field }) => (
                        <FormItem><FormLabel>Heading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={homepageForm.control as any} name="socialProof.subheading" render={({ field }) => (
                        <FormItem><FormLabel>Subheading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
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
