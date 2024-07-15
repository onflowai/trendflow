import React, { useState } from 'react';
import {
  UserImgLarge,
  CustomErrorToast,
  FormComponentLogos,
  CustomSuccessToast,
} from '../components';
import Container from '../assets/wrappers/SubmitFormContainer';
import { useOutletContext } from 'react-router-dom';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

const AddBlog = () => {
  return <Container></Container>;
};

export default AddBlog;
