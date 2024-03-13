import React from 'react';
import { useNavigation } from 'react-router-dom';
/**
 * TODO: set up this reusable component
 * Component which will be used for all th submit buttons in Component if <SubmitButton fromBtn/> exists css executed
 * @param {*} param0
 * @returns
 */
function SubmitButton({ formBtn }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <button
      type="submit"
      className={`btn btn-block ${formBtn && 'from-btn'}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'submitting' : 'submit'}
    </button>
  );
}

export default SubmitButton;
