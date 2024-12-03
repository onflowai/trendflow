import React, { useState, useEffect } from 'react';
import {
  SelectTrends,
  UserImgLarge,
  EditMarkdown,
  FormComponent,
  TitleHighlighter,
  CustomErrorToast,
  CustomSuccessToast,
} from '../components';
import Container from '../assets/wrappers/AddBlogContainer';
import { IoCloseCircle } from 'react-icons/io5';
import {
  useOutletContext,
  useLoaderData,
  useParams,
  Form,
  useNavigation,
  redirect,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
// import '@uiw/react-markdown-editor/dist/markdown-editor.css'; //HERE
/**
 * AddBlog lets Admin create and edit blog when slug is present, the component is in "edit mode"
 * when no slug is present, the component is in "create mode".
 * @param {*} param0
 * @returns
 */
//loader for admin to edit existing blog if the slug is present in params
export const loader = async ({ params }) => {
  if (params.slug) {
    try {
      const { data } = await customFetch.get(`/blogs/${params.slug}`);
      const formattedTrends = data.trends.map((trend) => ({
        value: trend._id,
        label: trend.trend,
        svg_url: trend.svg_url,
        slug: trend.slug,
      }));
      return { blog: { ...data, trends: formattedTrends } };
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
      return redirect('/dashboard');
    }
  }
  return { blog: null };
};

// action for admin to create / update blog
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  data.trends = JSON.parse(data.trends);

  try {
    if (params.slug) {
      // Update existing blog
      await customFetch.patch(`/blogs/edit/${params.slug}`, data);
      toast.success(
        <CustomSuccessToast message={'Blog post updated successfully!'} />
      );
    } else {
      // Create new blog
      await customFetch.post('/blogs/create-post', data);
      toast.success(
        <CustomSuccessToast message={'Blog post created successfully!'} />
      );
    }
    return redirect('/dashboard/blog');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};

const getRandomColor = () => {
  const colors = ['#fcf9ed', '#fcedf8', '#f1f1ff'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const AddBlog = () => {
  const { user } = useOutletContext(); // Getting the user from DashboardLayout
  const { slug } = useParams();
  const loaderData = slug ? useLoaderData() : { blog: null };
  const blog = loaderData?.blog;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const navigate = useNavigate();

  const [title, setTitle] = useState(blog ? blog.title : '');
  const [content, setContent] = useState(blog ? blog.content : '');
  const [selectedTrends, setSelectedTrends] = useState(blog ? blog.trends : []);
  const [bgColor, setBgColor] = useState(getRandomColor());

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setSelectedTrends(blog.trends);
    }
    setBgColor(getRandomColor());
  }, [blog]);

  // handle delete action
  const handleDelete = async () => {
    if (!slug) return; // no slug, no delete
    try {
      await customFetch.delete(`/blogs/delete/${slug}`);
      toast.success(
        <CustomSuccessToast message={'Blog post deleted successfully!'} />
      );
      navigate('/dashboard/blog');
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
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
          <Form method="post" className="form">
            {/* HEADER */}
            <div className="header" style={{ backgroundColor: bgColor }}>
              <TitleHighlighter
                title={slug ? 'Edit Blog Post:' : 'Create a Blog Post:'}
              />
              {slug && (
                <div
                  className="delete-container"
                  onClick={handleDelete}
                  style={{ cursor: 'pointer' }}
                >
                  <IoCloseCircle
                    className="delete-icon"
                    title="Delete this post"
                  />
                </div>
              )}
            </div>
            <div className="form-center">
              <FormComponent
                defaultValue="Max 50 Characters"
                type="text"
                name="title"
                placeholder="Blog Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <SelectTrends
                labelText="Select Trend(s)"
                selectedTrends={selectedTrends}
                setSelectedTrends={(trends) => {
                  setSelectedTrends(trends);
                  const trendsField = document.querySelector(
                    'input[name="trends"]'
                  );
                  const trendIds = trends.map((trend) => trend.value);
                  trendsField.value = JSON.stringify(trendIds);
                }}
                placeholder="Search"
              />
              <input
                type="hidden"
                name="trends"
                value={JSON.stringify(
                  selectedTrends.map((trend) => trend.value)
                )}
              />
              <div className="edit-markdown">
                <EditMarkdown
                  initialContent={content}
                  onContentChange={(value) => {
                    setContent(value);
                  }}
                />
              </div>
              <input type="hidden" name="content" value={content} />
            </div>
            <div className="submit-container">
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
      </div>
    </Container>
  );
};

export default AddBlog;
