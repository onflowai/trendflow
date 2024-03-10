import React from 'react';
import Container from '../assets/wrappers/StatObjectContainer';
import {
  FcComboChart,
  FcStatistics,
  FcApproval,
  FcCancel,
} from 'react-icons/fc';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function StatObject({ stats }) {
  return (
    <Container>
      <header>
        <h1>Welcome Back, Marci</h1>
        <p>Here is the information about all your trends</p>
      </header>
      <div className="stats-container">
        <div className="stat">
          <div className="content-group">
            <div>
              <h3>{stats.users.toLocaleString()}</h3>
              <p>Total users</p>
            </div>
            <div className="icon-box">
              <FcComboChart />
            </div>
          </div>
          <div className="change positive">
            <FaArrowLeft /> +1.01% this week
          </div>
        </div>
        <div className="stat">
          <div className="content-group">
            <div>
              <h3>{stats.trends.toLocaleString()}</h3>
              <p>Total trends</p>
            </div>
            <div className="icon-box">
              <FcStatistics />
            </div>
          </div>
          <div className="change negative">
            <FaArrowRight /> +1.01% this week
          </div>
        </div>
        <div className="stat">
          <div className="content-group">
            <div>
              <h3>{stats.approved.toLocaleString()}</h3>
              <p>Total Approved Trends</p>
            </div>
            <div className="icon-box">
              <FcApproval />
            </div>
          </div>
          <div className="change positive">
            <FaArrowLeft /> +1.01% this week
          </div>
        </div>
        <div className="stat">
          <div className="content-group">
            <div>
              <h3>{stats.unapproved.toLocaleString()}</h3>
              <p>Total Unapproved Trends</p>
            </div>
            <div className="icon-box">
              <FcCancel />
            </div>
          </div>
          <div className="change positive">
            <FaArrowLeft /> +1.01% this week
          </div>
        </div>
      </div>
    </Container>
  );
}

export default StatObject;
