import {
  FormComponent,
  FormSelector,
  CustomErrorToast,
  CustomSuccessToast,
} from '../components';
import Container from '../assets/wrappers/DashboardFormContiner';
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
    toast.success(<CustomSuccessToast message={'Login Successful'} />);
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
      <Form method="post" className="form">
        <h4 className="form-title">Add Trend</h4>
        <div className="form-center">
          <FormComponent type="text" name="trend" />
          <FormSelector
            labelText="Category"
            name="trendCategory"
            defaultValue={TREND_CATEGORY.PROGRAMMING_LANGUAGES}
            list={Object.values(TREND_CATEGORY)}
          />
          <FormSelector
            labelText="Technology"
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
    </Container>
  );
};

export default AddTrend;
