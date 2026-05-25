import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Transformation from "@/components/Transformation";
import CourseModules from "@/components/CourseModules";
import HowItWorks from "@/components/HowItWorks";
import CoursePreview from "@/components/CoursePreview";
import ValueStack from "@/components/ValueStack";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import Instructor from "@/components/Instructor";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Guarantee from "@/components/Guarantee";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { CoursePageData } from "@/lib/courses/types";

type CourseLandingProps = {
  data: CoursePageData;
};

export default function CourseLanding({ data }: CourseLandingProps) {
  return (
    <>
      <Navbar data={data} />
      <main>
        <Hero data={data} />
        <ProblemSolution data={data} />
        <Transformation data={data} />
        <CourseModules data={data} />
        <HowItWorks data={data} />
        <CoursePreview data={data} />
        <ValueStack data={data} />
        <WhoIsThisFor data={data} />
        <Instructor data={data} />
        <Testimonials data={data} />
        <Pricing data={data} />
        <Guarantee data={data} />
        <FAQ data={data} />
        <FinalCTA data={data} />
      </main>
      <Footer />
      <StickyCTA data={data} />
      <WhatsAppFloat />
    </>
  );
}
