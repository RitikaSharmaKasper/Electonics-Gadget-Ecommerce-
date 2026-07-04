import { Link } from "react-router-dom"; // ✅ use react-router-dom

const EmptyState = ({
  heading = "No Items Found",
  description = "Looks like nothing is here yet.",
  icon: Icon, // only Lucide icon components
  ctaLabel = "Go Back",
  ctaLink,
  onClick, // optional
}) => {
  const buttonClasses =
    "inline-block bg-[#7A1F2B] hover:bg-[#7A1F2B] \
     text-white rounded-lg md:px-8 md:py-3 px-4 py-2 text-sm md:text-base font-medium transition-all shadow-md hover:shadow-lg";

  return (
    <div className="flex flex-col justify-center items-center text-center px-4 bg-white border border-[#F0EEFF] rounded-lg mb-5 py-10">
      {/* Icon Circle */}
      {Icon && (
        <div className="mx-auto md:w-28 md:h-28 w-16 h-16 bg-[#f1d5d9] rounded-full flex items-center justify-center mb-6 shadow-inner mt-28">
          <Icon className="md:w-14 md:h-14 w-8 h-8 text-[#7A1F2B]" />
        </div>
      )}

      {/* Heading */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#7A1F2B] mb-3">
        {heading}
      </h3>

      {/* Subtext */}
      <p className="text-sm md:text-base text-[#747877] max-w-sm mb-4 md:mb-8">
        {description}
      </p>

      {/* CTA: dynamic */}
      {ctaLink ? (
        <Link to={ctaLink} className={buttonClasses}>
          {ctaLabel}
        </Link>
      ) : onClick ? (
        <button onClick={onClick} className={buttonClasses}>
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
