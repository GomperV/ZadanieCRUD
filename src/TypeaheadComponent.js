import React, { useState, useEffect, Component } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './App.css';
import App from './App';


function TypeaheadComponent(props) {
  const [singleSelections, setSingleSelections] = useState([]);
  const options = [
    { name: 'IT' },
    { name: 'Programowanie' },
    { name: 'Java' },
    { name: 'C#' },
    { name: 'C++' },
    { name: 'JavaScript' },
    { name: 'C' },
    { name: 'Ruby' },
    { name: 'Unity' },
    { name: 'Unreal Engine' },
    { name: 'Arduino' },
    { name: 'PLC' },
    { name: 'Web' },
    { name: 'ReactJS' },
    { name: 'Tech' },
    { name: 'Windows' },
    { name: 'Linux' },
    { name: 'Spring' },
    { name: 'Hibernate' },
    { name: 'Kotlin' },
    { name: 'Android' },
  ];

  const onKeywordsChange = (selected) => {
    const keywords = selected.map((option) => option.name).join(', ');
    setSingleSelections(selected);
    props.onKeywordsChange(keywords);
  };

  const [newCampaignKeywords, setNewCampaignKeywords] = useState('');

  useEffect(() => {
    setNewCampaignKeywords(singleSelections.map((option) => option.name).join(', '));
  }, [singleSelections]);

  return (
    <Form.Group style={{ marginTop: '20px' }}>
      <Typeahead
        id="basic-typeahead-multiple"
        labelKey="name"
        onChange={onKeywordsChange}
        options={options}
        placeholder="Choose keyword"
        inputProps={{
          class: 'my-custom-classname',
          style: {
            backgroundColor: 'white',
          }
        }}
      />
    </Form.Group>
  );
}
export default TypeaheadComponent;