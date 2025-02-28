import { PiTrendUp, PiTrendDown } from 'react-icons/pi'; //trending icons, cool-off icons
import { RxCountdownTimer } from 'react-icons/rx';
import { IoTimeOutline } from 'react-icons/io5';
import {
  HiOutlineArrowLongUp,
  HiOutlineArrowLongRight,
  HiOutlineArrowLongDown,
} from 'react-icons/hi2'; //breakout icon, static icon, arrow down sublevel
import { IoCheckmark, IoCloseOutline } from 'react-icons/io5'; //approved, unapproved icons
import { TbMathAvg } from 'react-icons/tb';

// const BASE_URL = '/src/assets/images/icons';
// const CAT_URL = '/src/assets/images/icons/cat';
//---------------------------------------------
export const TIME = {
  NEWEST: { value: 'newest', label: 'Newest', icon: RxCountdownTimer },
  OLDEST: { value: 'oldest', label: 'Oldest', icon: PiTrendUp },
  NEWEST_MONTH: {
    value: 'newestMonth',
    label: 'Newest Month',
    icon: PiTrendUp,
  },
  NEWEST_YEAR: { value: 'newestYear', label: 'Newest Year', icon: PiTrendUp },
};

export const STATUS = {
  TRENDING: {
    value: 'trending',
    label: 'Trending',
    icon: PiTrendUp,
  },
  BREAKOUT: {
    value: 'breakout',
    label: 'Breakout',
    icon: HiOutlineArrowLongUp,
  },
  COOLOFF: { value: 'cool-off', label: 'Cool Off', icon: PiTrendDown },
  STATIC: { value: 'static', label: 'Static', icon: HiOutlineArrowLongRight },
  SUBLEVEL: {
    value: 'sublevel',
    label: 'Sublevel',
    icon: HiOutlineArrowLongDown,
  },
  UNDEFINED: {
    value: 'undefined',
    label: 'Undefined',
    icon: TbMathAvg,
  },
};
export const ADMIN_STATUS = {
  APPROVED: {
    value: 'approved',
    label: 'Approved',
    icon: IoCheckmark,
  },
  UN_APPROVED: {
    value: 'un-approved',
    label: 'Un-Approved',
    icon: IoCloseOutline,
  },
  TRENDING: {
    value: 'trending',
    label: 'Trending',
    icon: PiTrendUp,
  },
  BREAKOUT: {
    value: 'breakout',
    label: 'Breakout',
    icon: HiOutlineArrowLongUp,
  },
  COOLOFF: { value: 'cool-off', label: 'Cool Off', icon: PiTrendDown },
  STATIC: { value: 'static', label: 'Static', icon: HiOutlineArrowLongRight },
  SUBLEVEL: {
    value: 'sublevel',
    label: 'Sublevel',
    icon: HiOutlineArrowLongDown,
  },
  UNDEFINED: {
    value: 'undefined',
    label: 'Undefined',
    icon: TbMathAvg,
  },
};

export const SORT_OPTIONS = {
  TOP_RATED_NOW: {
    value: 'topRatedNow',
    label: 'Top Rated Now',
    description: 'Filter top trend based on top data and views',
  },
  TOP_RATED_YEAR: {
    value: 'topRatedYear',
    label: 'Top Rated Year',
    description: 'Filter top trend this year using top data and views',
  },
  TOP_RATED_MONTH: {
    value: 'topRatedMonth',
    label: 'Top Rated Month',
    description: 'Filter top trend this month using top data and views',
  },
  TOP_VIEWED_NOW: {
    value: 'topViewedNow',
    label: 'Top Viewed Now',
    description: 'Filter top trend soley based on user views',
  },
  TOP_VIEWED_YEAR: {
    value: 'topViewedYear',
    label: 'Top Viewed Year',
    description: 'Filter top trend this year soley based on user views',
  },
  TOP_VIEWED_MONTH: {
    value: 'topViewedMonth',
    label: 'Top Viewed Month',
    description: 'Filter top trend this month soley based on user views',
  },
};
///////////////////////////////////////////////////////////////////////////////
export const EDIT_PAGE_USE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lorem Ipsum Example</title>
</head>
<body>
    <p>This is a Example data before approval of the Trend, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
    
    <ul>
        <li>Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.</li>
        <li>Pellentesque in ipsum id orci porta dapibus.</li>
        <li>Proin eget tortor risus.</li>
    </ul>
    
    <p>Nulla quis lorem ut libero malesuada feugiat. Cras ultricies ligula sed magna dictum porta. Quisque velit nisi, pretium ut lacinia in, elementum id enim.</p>
</body>
</html>`;

export const EDIT_PAGE_POST = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Getting Started with Lorem Ipsum for Startups</title>
</head>
<body>
    <h2>Introduction to Lorem Ipsum</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut facilisis, lectus nec posuere fermentum, velit mauris dictum eros, at fermentum nunc neque ac dui. Phasellus auctor turpis nec quam tristique, at congue libero malesuada.</p>
    
    <h3>Setting Up Your Environment</h3>
    <p>Nulla facilisi. Donec convallis tincidunt diam, id tincidunt quam blandit a. Fusce euismod vehicula magna, eget fermentum lorem vestibulum ut.</p>
    
    <h4>Install Necessary Tools</h4>
    <p>To get started, install the necessary tools using the following commands:</p>
    <pre><code class="language-bash">sudo apt-get install lorem-ipsum-toolkit</code></pre>
    
    <h3>Creating Your First Lorem Ipsum Component</h3>
    <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris feugiat, purus ut bibendum ultricies, mi urna fringilla libero, eget lacinia velit nunc nec velit.</p>
    
    <h4>Component Structure</h4>
    <p>Create a new component file and add the following code:</p>
    <pre><code class="language-javascript">import React from 'react';

const LoremIpsumComponent = () => {
    return (
        <div>
            <h2>Lorem Ipsum Component</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    );
};

export default LoremIpsumComponent;</code></pre>
    
    <h4>Customizing Lorem Ipsum</h4>
    <p>To customize the Lorem Ipsum text, modify the configuration file:</p>
    <pre><code class="language-json">{
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "length": 1000
}</code></pre>
    
    <h3>Conclusion</h3>
    <p>Nam eget orci nulla. Ut venenatis, nisl at vehicula aliquet, augue augue dictum quam, eget condimentum lectus orci nec lacus. Startups can leverage Lorem Ipsum to quickly build and iterate on ideas, allowing for rapid innovation and development.</p>
</body>
</html>`;
