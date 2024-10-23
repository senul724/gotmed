"use client";

import { Field, Form, Formik } from "formik";
import { MapProvider } from "@/components/map/MapProvider";
import { Cordinates, MapView } from "@/components/map/MapView";
import { useState } from "react";

export default function Request() {
  const [location, setLocation] = useState<Cordinates | null>(null);
  const [final, setFinal] = useState(false);
  return (
    <div className="max-w-3xl w-full bg-white p-2 min-h-screen shadow py-20 px-20">
      <h2 className="text-4xl font-semibold text-gray-800">Add Request</h2>
      <h2 className="text-md text-gray-400 mt-4">
        Request all the pharmacies near you and get notified instantly if they
        have your medications!
      </h2>
      <Formik
        initialValues={{ radius: 1, info: "", content: "", doc: true }}
        onSubmit={(values) => console.log(values)}
      >
        {({ values, setFieldValue }) => (
          <>
            {!final
              ? (
                <>
                  <h2 className="text-lg text-gray-500 mb-10 mt-16 border-b">
                    Let us know where you are
                  </h2>
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
                  <h2 className="text-lg text-gray-800 mt-16 border-b">
                    Search radius
                  </h2>
                  <p className="mb-5 text-sm text-gray-400">
                    The maximum distance from the farthest pharmacy to your
                    specifed location
                  </p>
                  <div className="flex items-center gap-4">
                    <Field
                      type="number"
                      className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500      "
                      name="radius"
                    />
                    <span className="text-sm text-gray-700">KM</span>
                  </div>

                  <h2 className="text-lg text-gray-800 mt-10">
                    About your medicine
                  </h2>
                  {!values.doc
                    ? (
                      <>
                        <h2 className="text-lg text-gray-800 mt-5 border-b w-1/2">
                          Enter names manually
                        </h2>
                        <p
                          className="text-sm text-primary underline my-4 w-full text-right cursor-pointer"
                          onClick={() => setFieldValue("doc", true)}
                        >
                          I have a prescription
                        </p>

                        <div className="flex items-center">
                          <div className="relative w-full">
                            <Field
                              as="textarea"
                              className="z-20 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 h-40"
                              placeholder="panadol, amoxilin, ect..."
                              name="content"
                            />
                          </div>
                        </div>
                      </>
                    )
                    : (
                      <>
                        <h2 className="text-lg text-gray-800 mt-5 border-b w-1/2">
                          Upload prescription
                        </h2>
                        <p
                          className="text-sm text-primary underline my-4 w-full text-right cursor-pointer"
                          onClick={() => setFieldValue("doc", false)}
                        >
                          I don't have a prescription
                        </p>
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Pleas add .csv files only (MAX. 50MB)
                              </p>
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                            />
                          </label>
                        </div>
                      </>
                    )}

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
                        placeholder="need this for 3 months"
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
