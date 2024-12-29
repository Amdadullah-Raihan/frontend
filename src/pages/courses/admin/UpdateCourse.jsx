/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

import Input from '../../../components/inputs/Input';
import Button from '../../../components/buttons/Button';
import axiosInstance from '../../../api/axiosInstance';

const UpdateCourse = ({ editingCourse, setEditingCourse, onUpdateSuccess }) => {
  const [title, setTitle] = useState(editingCourse.title);
  const [description, setDescription] = useState(editingCourse.description);
  const [videos, setVideos] = useState(editingCourse.videos || []);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVideoChange = (index, event) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      file: event.target.files[0],
    };
    setVideos(updatedVideos);
  };
  const logFormData = (formData) => {
    const formDataObject = {};
    for (let pair of formData.entries()) {
      // Convert FormData entry to a plain object if it's an array of objects
      if (pair[0].startsWith('videos[')) {
        const [key, value] = pair;
        const regexResult = key.match(/\[(.*?)\]/g);
        if (regexResult.length === 2) {
          const index = regexResult[0].replace(/[\[\]']+/g, '');
          const prop = regexResult[1].replace(/[\[\]']+/g, '');
          if (!formDataObject.videos) formDataObject.videos = [];
          if (!formDataObject.videos[index]) formDataObject.videos[index] = {};
          formDataObject.videos[index][prop] = value;
        }
      } else {
        formDataObject[pair[0]] = pair[1];
      }
    }
    return formDataObject;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    videos.forEach((video, index) => {
      if (video.file) {
        formData.append(`videos[${index}][file]`, video.file);
        formData.append(`videos[${index}][title]`, video.title);
      } else {
        formData.append(`videos[${index}][title]`, video.title);
        formData.append(`videos[${index}][url]`, video.url);
      }
    });
    const formDataObject = logFormData(formData);
    try {
      setIsUpdating(true);
      const response = await axiosInstance.put(
        `/api/courses/${editingCourse._id}`,
        formDataObject,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      onUpdateSuccess(response.data);
      toast.success('Course updated successfully');
      setEditingCourse(null);
    } catch (error) {
      console.error(
        'Error updating course:',
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || 'Failed to update course');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] p-4 bg-black bg-opacity-30 backdrop-blur-sm md:p-8 lg:p-16">
      {isUpdating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center w-full h-full bg-black bg-opacity-90">
          <div className="text-green-400 text-lg font-bold z-[300]">
            Updating the course...
          </div>
        </div>
      )}

      <X
        className="absolute z-50 p-1 text-white bg-red-500 rounded-full top-4 right-4 hover:bg-rose-600 hover:cursor-pointer"
        onClick={() => setEditingCourse(null)}
      />
      <form
        onSubmit={handleSubmit}
        className="max-w-lg max-h-full p-4 mx-auto mb-4 overflow-y-auto bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl"
      >
        <div className="mb-4">
          <Input
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            required
            label="Update Course Title"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Course Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            className="block w-full px-3 py-2 border  dark:bg-gray-700 dark:border-none rounded-md focus:outline-primary sm:text-sm"
            rows="3"
            required
          ></textarea>
        </div>
        {videos.map((video, index) => (
          <div
            key={index}
            className="p-4 mb-4 border dark:border-gray-700 rounded-lg"
          >
            <label className="flex flex-col gap-2 text-sm font-medium capitalize">
              {index + 1}. Update Video Title
              <Input
                type="text"
                name={`videos[${index}][title]`}
                defaultValue={video.title}
                className="block w-full px-3 py-2 mb-2 border  rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label className="flex flex-col gap-2 mt-2">
              Update Video
              <input
                type="file"
                name={`videos[${index}][file]`}
                accept="video/*"
                onChange={(event) => handleVideoChange(index, event)}
                className="block w-full text-sm text-gray-500 mt file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primaryDark"
              />
            </label>
          </div>
        ))}
        <div className="flex justify-end space-x-4 text-right">
          <Button
            variant="danger"
            type="button"
            onClick={() => setEditingCourse(null)}
          >
            Cancel
          </Button>
          <Button type="submit">Update Course</Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;
