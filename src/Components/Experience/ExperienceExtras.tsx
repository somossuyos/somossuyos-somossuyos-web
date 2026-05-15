interface ExperienceExtrasProps {
  extras?: string;
}

const ExperienceExtras = ({ extras }: ExperienceExtrasProps) => {
  if (!extras) {
    return null;
  }

  return (
    <div className="px-[10%] mt-10 flex flex-col gap-2 lg:text-[21px]">
      <div dangerouslySetInnerHTML={{ __html: extras }}></div>
    </div>
  );
};

export default ExperienceExtras;