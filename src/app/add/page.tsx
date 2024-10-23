"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { MapProvider } from "@/components/map/MapProvider";
import { Cordinates, MapView } from "@/components/map/MapView";
import { useState } from "react";
import PlaceSearch from "@/components/map/PlaceSearch";

export default function Request() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [location, setLocation] = useState<Cordinates | null>(null);
  const [final, setFinal] = useState(false);
  return (
    <div className="max-w-3xl w-full bg-white p-2 min-h-screen shadow py-20 px-20 text-black">
      <h2 className="text-4xl font-semibold text-gray-800">Add Pharmacy</h2>
      <h2 className="text-md text-gray-400 mt-4">
        Add your pharmacy and fill the need of the demanding customers
      </h2>
      <Formik
        initialValues={{
          radius: 1,
          info: "",
          content: "",
          doc: true,
          location: "",
        }}
        onSubmit={(values) => console.log(values)}
      >
        {({ setFieldValue }) => (
          <>
            {!final
              ? (
                <>
                  <h2 className="text-lg text-gray-500 mb-10 mt-16 border-b">
                    Let us know where you are
                  </h2>
                  <PlaceSearch
                    fieldName="location"
                    setValue={(value) => setFieldValue("location", value)}
                    setLocation={setLocation}
                  />
                  <br />
                  <MapProvider>
                    <MapView location={location} setLocation={setLocation} />
                  </MapProvider>
                  <div className="w-full flex item-center justify-end p-5">
                    <button
                      className="border rounded px-5 py-1 shadow hover:scale-105"
                      type="button"
                      onClick={() => setFinal((prev) => !prev)}
                    >
                      next
                    </button>
                  </div>
                </>
              )
              : (
                <Form>
                  <div className="mt-10">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pharmacy Name
                    </label>
                    <Field
                      name="name"
                      as={Input}
                      id="name"
                      placeholder="Enter pharmacy name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <h2 className="text-lg text-gray-800 mt-10 border-b">
                    Business Hour
                  </h2>
                  <p className="mb-5 text-sm text-gray-400">
                    state your business hour and business days here
                  </p>
                  <div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {days.map((day) => (
                        <Field
                          key={day}
                          name="businessHours.days"
                          type="checkbox"
                          value={day}
                          as={Checkbox}
                          id={`day-${day}`}
                          label={day}
                        />
                      ))}
                    </div>
                    <ErrorMessage
                      name="businessHours.days"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    <div className="flex space-x-4 mt-2">
                      <div className="flex-1">
                        <label
                          htmlFor="openTime"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Open Time
                        </label>
                        <Field
                          name="businessHours.openTime"
                          as={TimeInput}
                          id="openTime"
                        />
                        <ErrorMessage
                          name="businessHours.openTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="closeTime"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Close Time
                        </label>
                        <Field
                          name="businessHours.closeTime"
                          as={TimeInput}
                          id="closeTime"
                        />
                        <ErrorMessage
                          name="businessHours.closeTime"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <h2 className="text-lg text-gray-800 mt-10 border-b">
                    Additional information
                  </h2>
                  <p className="mb-5 text-sm text-gray-400">
                    Add any additional information that you want them to know
                  </p>
                  <div className="flex items-center">
                    <div className="relative w-full">
                      <Field
                        as="textarea"
                        className="z-20 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 h-40"
                        placeholder="May be a description about your pharmacy"
                        name="info"
                      />
                    </div>
                  </div>

                  <div className="w-full flex item-center justify-center p-5 mt-10">
                    <div className="w-1/2 flex item-center">
                      <button
                        className="border rounded px-5 py-1 shadow hover:scale-105"
                        type="button"
                        onClick={() => setFinal((prev) => !prev)}
                      >
                        back
                      </button>
                    </div>
                    <div className="w-1/2 flex item-center justify-end">
                      <button
                        className="border rounded px-5 py-1 shadow hover:scale-105"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              )}
          </>
        )}
      </Formik>
    </div>
  );
}
// Custom Checkbox component
const Checkbox = ({ field, form, label, ...props }: any) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      {...field}
      {...props}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <label htmlFor={props.id} className="ml-2 text-sm text-gray-700">
      {label}
    </label>
  </div>
);

const TimeInput = ({ field, form, ...props }: any) => (
  <input
    type="time"
    {...field}
    {...props}
    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
  />
);

const Input = ({ field, form, ...props }: any) => (
  <input
    {...field}
    {...props}
    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
  />
);
