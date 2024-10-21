import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import { useTranslation } from 'react-i18next';

const LatestJobs = () => {
	const { t } = useTranslation();
	const { allJobs } = useSelector(store => store.job);

	return (
		<div className="my-10 sm:my-16 md:my-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
				<span className="text-[#723bcf]">{t('latestAndTop')} </span>
				{t('jobOpenings')}
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{allJobs.length <= 0 ? (
					<span className="col-span-full text-center">{t('noJobAvailable')}</span>
				) : (
					allJobs?.slice(0, 6).map((job) => (
						<LatestJobCards key={job.job_id} job={job} />
					))
				)}
			</div>
		</div>
	);
};

export default LatestJobs;