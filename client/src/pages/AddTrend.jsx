import {
  FormSelector,
  UserImgLarge,
  FallbackChart,
  CustomErrorToast,
  FormComponentLogos,
  CustomSuccessToast,
} from '../components';
import Container from '../assets/wrappers/SubmitFormContainer';
import { useOutletContext } from 'react-router-dom';
import { TREND_CATEGORY, TECHNOLOGIES } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/trends/submit', data);
    toast.success(
      <CustomSuccessToast message={'Thank You, Trend Was Submitted'} />
    );
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};

const AddTrend = () => {
  const { user } = useOutletContext(); //getting the user from DashboardLayout
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Container>
      <div className="user-container clearfix">
        <div className="user-info">
          <div className="user-profile">
            <UserImgLarge user_img={user.profile_img} />
          </div>
          <div className="username">
            <h5>{user.username}</h5>
          </div>
        </div>
      </div>
      <div className="submit-container">
        <div>
          <Form method="post" className="form">
            <h4 className="form-title">Submit a Tech:</h4>
            <div className="form-center">
              {/* <LogoCarousel /> */}
              <FormComponentLogos
                type="text"
                name="Trend"
                placeholder="Any tech on your mind?"
              />
              {/* <FormComponent type="text" name="Any tech on your mind?" /> */}
              <FormSelector
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={TREND_CATEGORY.PROGRAMMING_LANGUAGES}
                list={Object.values(TREND_CATEGORY)}
              />
              <FormSelector
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue={TECHNOLOGIES.ADA}
                list={Object.values(TECHNOLOGIES)}
              />
              <button
                type="submit"
                className="btn btn-block form-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'submitting' : 'submit'}
              </button>
            </div>
          </Form>
        </div>
        <div className="chart-container">
          <FallbackChart />
        </div>
      </div>
    </Container>
  );
};

export default AddTrend;
