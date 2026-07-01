import { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../components/Breadcrumbs";
import Filter from "../components/Filter";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

import EmptyState from "../components/EmptyState";
import { PackageOpen } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

function Product() {
  const [param, setParam] = useState("");
  const [color, setColor] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { categorySlug, subcategorySlug, subcategoryName, subcategory } =
    useParams();
  const { state } = useLocation();
  const val = state;

  // console.log(val);

  const applySubcategoryFilter = (products, subcategory) => {
    if (!subcategory || subcategory === "All") return products;

    const sub = subcategory.toLowerCase();

    return products.filter((p) => {
      const productSubcategoryName = (
        p.subcategoryName ||
        p.subcategory?.name ||
        ""
      ).toLowerCase();

      const productSubcategorySlug = (
        p.subcategorySlug ||
        p.subcategory?.slug ||
        ""
      ).toLowerCase();

      return productSubcategoryName === sub || productSubcategorySlug === sub;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const categoryValue =
          state?.category ||
          state?.categorySlug ||
          decodeURIComponent(categorySlug || "");

        const subcategoryValue =
          state?.subcategory ||
          state?.subcategorySlug ||
          decodeURIComponent(
            subcategorySlug || subcategoryName || subcategory || "",
          );

        const res = await axiosInstance.get("/product/all", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const fetchedProducts = res?.data?.data || res?.data?.products || [];

        let filteredProducts = fetchedProducts;

        if (categoryValue) {
          const cat = categoryValue.toLowerCase();

          filteredProducts = filteredProducts.filter((p) => {
            const productCategoryName = (
              p.categoryName ||
              p.category?.name ||
              ""
            ).toLowerCase();

            const productCategorySlug = (
              p.categorySlug ||
              p.category?.slug ||
              ""
            ).toLowerCase();

            return productCategoryName === cat || productCategorySlug === cat;
          });
        }

        if (subcategoryValue) {
          filteredProducts = applySubcategoryFilter(
            filteredProducts,
            subcategoryValue,
          );
        }

        filteredProducts = applySubcategoryFilter(
          filteredProducts,
          selectedSubcategory,
        );

        setItems(filteredProducts);
        setOriginalItems(filteredProducts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    categorySlug,
    subcategorySlug,
    subcategoryName,
    subcategory,
    selectedSubcategory,
    state?.category,
    state?.subcategory,
    state?.subcategorySlug,
  ]);

  const colors = useMemo(() => {
    const uniqueColors = new Set();

    originalItems.forEach((item) => {
      if (item.variants && Array.isArray(item.variants)) {
        item.variants?.forEach((variant) => {
          if (variant.variantColor) {
            uniqueColors.add(variant.variantColor.toLowerCase());
          }
        });
      }
    });

    return [...uniqueColors].map((colorName) => ({ colorName }));
  }, [originalItems]);

  const sort = (val) => {
    let sortedItems = [...items];

    switch (val) {
      case "high":
        sortedItems.sort(
          (a, b) => (b.defaultPrice || 0) - (a.defaultPrice || 0),
        );
        break;

      case "low":
        sortedItems.sort(
          (a, b) => (a.defaultPrice || 0) - (b.defaultPrice || 0),
        );
        break;

      case "atoz":
        sortedItems.sort((a, b) =>
          (a.name || a.productTittle || "").localeCompare(
            b.name || b.productTittle || "",
          ),
        );
        break;

      case "rating":
        sortedItems.sort((a, b) => {
          const avgA = a.stats?.averageRating || 0;
          const avgB = b.stats?.averageRating || 0;
          return avgB - avgA;
        });
        break;

      case "latest":
        sortedItems.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        break;

      default:
        sortedItems = [...originalItems];
        break;
    }

    setItems(sortedItems);
  };

  const filterArts = items.filter((p) => {
    if (typeof param !== "string" || !param.trim()) return true;

    const search = param.toLowerCase();

    return (
      (p.name || p.productTittle || "").toLowerCase().includes(search) ||
      (p.categoryName || p.category?.name || "")
        .toLowerCase()
        .includes(search) ||
      (p.subcategoryName || p.subcategory?.name || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const filteredArts = filterArts.filter(
    (p) =>
      !color.length ||
      p.variants?.some((v) => color.includes(v.variantColor?.toLowerCase())),
  );
  // get display names for breadcrumbs
  const displayCategory =
    state?.category || decodeURIComponent(categorySlug || "");

  const displaySubcategory =
    state?.subcategory ||
    decodeURIComponent(subcategorySlug || subcategoryName || subcategory || "");

  return (
    <>
      <Navbar />

      <div className="hidden sm:block">
        <Breadcrumbs
          category={displayCategory}
          subcategory={displaySubcategory}
        />
      </div>

      <div className="flex flex-col lg:px-20 md:px-[60px] px-4 pb-[23px] gap-4  mt-14 sm:mt-0">
        {/* Heading */}
        <div className="mt-14 sm:mt-0">
          <span className="text-lg md:text-xl font-semibold capitalize font-marcellus text-[#126B6D]">
            {state?.category || displayCategory || "All Products"}
          </span>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter */}
          <div className="w-full lg:w-[280px]">
            <Filter
              setParam={setParam}
              val={val}
              colors={colors}
              setColor={setColor}
              sort={sort}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <p className="text-[#747877]">Loading products...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredArts.length === 0 ? (
              <EmptyState
                heading="No Products Found"
                description="We couldn’t find any products matching your filters."
                icon={PackageOpen}
                ctaLabel="Reset Filters"
                onClick={() => {
                  setParam("");
                  setColor([]);
                  setItems(originalItems);
                }}
              />
            ) : (
              <Card cardData={filteredArts} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Product;
