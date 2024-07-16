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

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  data.trends = JSON.parse(data.trends); // Parse trends back to array
  console.log('Data which is being sent: ', data);
  try {
    await customFetch.post('/blog/create-post', data);
    toast.success(
      <CustomSuccessToast message={'Thank You, Blog Post Was Submitted'} />
    );
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};

const AddBlog = () => {
  const { user } = useOutletContext(); // Getting the user from DashboardLayout
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrends, setSelectedTrends] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await customFetch.get(`/trends?search=${searchTerm}`);
      setSearchResults(response.data.trends);
    } catch (error) {
      console.error('Error searching trends:', error);
    }
  };

  const handleAddTrend = (trend) => {
    if (!selectedTrends.find((t) => t._id === trend._id)) {
      setSelectedTrends([...selectedTrends, trend]);
    }
  };

  const handleRemoveTrend = (trendId) => {
    setSelectedTrends(selectedTrends.filter((trend) => trend._id !== trendId));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trendIds = selectedTrends.map((trend) => trend._id);

    try {
      await customFetch.post('/blog/create-post', {
        title,
        content,
        author: user._id,
        trends: trendIds,
      });
      toast.success(
        <CustomSuccessToast message={'Blog post created successfully!'} />
      );
    } catch (error) {
      toast.error(<CustomErrorToast message={'Failed to create blog post.'} />);
    }
  };

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
          <Form method="post" className="form" onSubmit={handleSubmit}>
            <h4 className="form-title">Create a Blog Post:</h4>
            <div className="form-center">
              <FormComponentLogos
                type="text"
                name="title"
                placeholder="Blog Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <FormComponentLogos
                type="textarea"
                name="content"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div>
                <label>Search Trends</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" onClick={handleSearch}>
                  Search
                </button>
              </div>
              <div>
                <ul>
                  {searchResults.map((trend) => (
                    <li key={trend._id}>
                      {trend.trend}
                      <button
                        type="button"
                        onClick={() => handleAddTrend(trend)}
                      >
                        +
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Selected Trends</h4>
                <ul>
                  {selectedTrends.map((trend) => (
                    <li key={trend._id}>
                      {trend.trend}
                      <button
                        type="button"
                        onClick={() => handleRemoveTrend(trend._id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
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
          {/* Add any additional components like FallbackChart if needed */}
        </div>
      </div>
    </Container>
  );
};

export default AddBlog;
