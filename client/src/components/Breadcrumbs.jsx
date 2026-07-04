import React from "react";
import { Link } from "react-router-dom";

function Breadcrumbs({ category, subcategory, title }) {
  const categoryName = category?.name || category;
  const categorySlug =
    category?.slug ||
    (category ? String(category).toLowerCase().replace(/\s+/g, "-") : "");

  const subcategoryName = subcategory?.name || subcategory;
  const subcategorySlug =
    subcategory?.slug ||
    (subcategory ? String(subcategory).toLowerCase().replace(/\s+/g, "-") : "");

  // console.log("Breadcrumbs received:", { category, subcategory, title });
  return (
    <nav
      className="hidden lg:flex md:flex lg:px-20 md:px-[60px] px-3 py-3  border-b border-[#F0EEFF] mt-5 pt-24"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center text-sm space-x-2">
        {/* Home */}
        <li className="inline-flex items-center flex-shrink-0">
          <Link to="/home" className="inline-flex items-center text-[#747877] hover:text-[#7A1F2B]">
            Home
          </Link>
        </li>

        {/* Category */}
        {categoryName && (
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <SeparatorIcon />
              <Link
                to={`/products/${encodeURIComponent(categorySlug)}`}
                state={{
                  category: categoryName,
                  slug: categorySlug,
                }}
                className="ms-1 text-[#7A1F2B] truncate max-w-[120px] sm:max-w-none"
              >
                {categoryName}
              </Link>
            </div>
          </li>
        )}

        {/* Subcategory */}
        {subcategoryName && (
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <SeparatorIcon />
              <Link
                to={`/products/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}`}
                state={{
                  category: categoryName,
                  subcategory: subcategoryName,
                  slug: categorySlug,
                  subcategorySlug,
                }}
                className="ms-1 text-[#7A1F2B] truncate max-w-[120px] sm:max-w-none"
              >
                {subcategoryName}
              </Link>
            </div>
          </li>
        )}

        {/* Product / Last Crumb */}
        {title && (
          <li className="flex-shrink-0">
            <div className="flex items-center">
              <SeparatorIcon />
              <span className="ms-1 text-[#192324] truncate max-w-[150px] sm:max-w-none">
                {title}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
}

/* Small chevron separator extracted to keep DRY */
function SeparatorIcon() {
  return (
    <svg
      className="rtl:rotate-180 w-3 h-3 text-[#5d5e5] mx-1"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 6 10"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 9 4-4-4-4"
      />
    </svg>
  );
}

export default Breadcrumbs;
