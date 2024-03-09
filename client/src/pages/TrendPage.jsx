import React from 'react';
import { FcElectricity, FcCalendar, FcApproval } from 'react-icons/fc';
import { CustomErrorToast } from '../components';
import Container from '../assets/wrappers/TrendPageContainer';
import {
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
day.extend(advancedFormat);
/**
 * Trend Page will display detailed information about the trend
 * @returns
 *
 */
//Fetching the trend data
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/trends/${params.slug}`);
    return data;
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};

const EditTrend = () => {
  const { trendObject } = useLoaderData(); //getting the trend from the loader above
  const { trend, trendCategory, trendTech, updatedAt } = trendObject;
  const upDate = day(updatedAt).format('MM YYYY');
  console.log(trendObject);
  return (
    <Container>
      <div className="trend">
        <h4 className="trend-title">{trend}</h4>
        <div className="trend-center">{trendCategory}</div>
        <span className="icon">
          <FcElectricity />
        </span>
        <span className="">{trendTech}</span>
        <span className="icon">
          <FcCalendar />
        </span>
        <span className="">{upDate}</span>
      </div>
    </Container>
  );
};

export default EditTrend;
