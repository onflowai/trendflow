import React, { useEffect, useState } from 'react';
import {
  SEOProtected,
  FormSelector,
  DangerousHTML,
  FallbackChart,
  FormComponent,
  CustomErrorToast,
  FormComponentLock,
  CustomSuccessToast,
  ScrollSpyComponent,
  ContentBoxHighlighted,
  ChartEditTrendComponent,
} from '../components';
import Container from '../assets/wrappers/EditTrendContainer';
// import Container from '../assets/wrappers/TrendPageContainer';
import { TREND_CATEGORY, TECHNOLOGIES } from '../../../utils/constants'; //this is a problem, need to fetch this instead of importing
import { EDIT_PAGE_USE, EDIT_PAGE_POST } from '../utils/constants.js';
import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
/**
 * Edit Page is only accessible to admin user to edit certain felids of the trend and POST them
 * @returns
 *
 */
//Fetching the trend data
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get('/users/current-user'); // Fetch current user
    if (!data.user || data.user.role !== 'admin') {
      toast.error(
        <CustomErrorToast message="Unauthorized access to this Resource!" />
      );
      return redirect('/dashboard');
    }
    const trendResponse = await customFetch.get(`/trends/edit/${params.slug}`);
    return { user: data.user, trendObject: trendResponse.data.trendObject };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
//action for editing the trend
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log('DATE TO BE EDITED: ', data);
  try {
    await customFetch.patch(`/trends/edit/${params.slug}`, data);
    toast.success(<CustomSuccessToast message={'Trend Edited'} />);
    return redirect('/admin');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};

const EditTrend = () => {
  const { trendObject } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useLoaderData();
  const isSubmitting = navigation.state === 'submitting';
  const [svgFile, setSvgFile] = useState(null);
  const [svgUrl, setSvgUrl] = useState(trendObject.svg_url || '');
  const [selectedCategory, setSelectedCategory] = useState(
    trendObject.trendCategory
  );
  const [selectedTech, setSelectedTech] = useState(trendObject.trendTech);

  // approve a trend
  const approveTrend = async (slug) => {
    try {
      setLoadingSlug(slug); // start loading
      await customFetch.patch(`trends/${slug}/approve`);
      toast.success(<CustomSuccessToast message={'Trend Approved'} />);
      fetchFilteredTrends(searchValues); // refresh the trends list
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setLoadingSlug(null); // stop loading
    }
  };
  // Modify manualApproveTrend to accept JSON data
  const manualApproveTrend = async (slug, data) => {
    try {
      setLoadingSlug(slug); // start loading
      setShowAddTrendModal(false); //close modal
      await customFetch.patch(`trends/${slug}/manual-approve`, { data });
      toast.success(<CustomSuccessToast message={'Trend Manually Approved'} />);
      fetchFilteredTrends(searchValues); // refresh the trends list
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Error approving trend');
    } finally {
      setLoadingSlug(null); // stop loading
    }
  };
  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await customFetch.get(
          `/trends/get-trend-svg/${trendObject.slug}`
        );
        setSvgUrl(response.data.svg_url);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSVG();
  }, [trendObject.slug]);

  const handleSVGUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await customFetch.patch(
        `/trends/upload-trend-svg/${trendObject.slug}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('SVG uploaded successfully');
    } catch (error) {
      toast.error('SVG upload failed');
    }
  };

  const handleSVGChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSvgFile(file);
      handleSVGUpload(file);
    }
  };

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/trends/edit/${trendObject.slug}`);
      toast.success(<CustomSuccessToast message={'Trend Deleted'} />);
      navigate('/dashboard'); // Redirect after deletion
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  };

  return (
    <Container>
      <SEOProtected />
      <div id="Edit"></div>
      <div className="trend-page-container">
        <div className="page-layout">
          <div className="trend">
            <div className="content">
              <div id="Submit"></div>
              <ChartEditTrendComponent
                svgUrl={svgUrl}
                handleSVGChange={handleSVGChange}
                trendObject={trendObject}
                isSubmitting={isSubmitting}
                trendCategoryList={Object.values(TREND_CATEGORY)}
                trendTechList={Object.values(TECHNOLOGIES)}
                onCategoryChange={(name, value) => setSelectedCategory(value)}
                onTechChange={(name, value) => setSelectedTech(value)}
                handleApproveClick={handleApproveClick}
                handleManualApprove={handleManualApprove}
              />
              <div className="trend-use-container">
                <ContentBoxHighlighted trendUse={EDIT_PAGE_USE} />
              </div>
              <div className="trend-blog-post">
                <DangerousHTML html={EDIT_PAGE_POST} />
              </div>
              <div id="Delete"></div>
            </div>
            <div className="form-actions">
              <div className="delete-btn">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn info-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <aside className="scroll-spy-sidebar-aside">
            <div className="scroll-spy-sidebar">
              <ScrollSpyComponent sectionIds={['Edit', 'Submit', 'Delete']} />
              <div></div>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
};

export default EditTrend;
