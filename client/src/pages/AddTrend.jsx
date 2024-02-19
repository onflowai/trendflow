import { FormComponent } from '../components';
import Container from '../assets/wrappers/DashboardForm';
import { useOutletContext } from 'react-router-dom';
import { TREND_CATEGORY, TECHNOLOGIES } from '../../../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

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
