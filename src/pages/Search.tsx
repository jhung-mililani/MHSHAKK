import React, { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { InsuranceProviders } from "~/server/api/routers/HealthcareRouter";
import { api } from "~/utils/api";
import Navbar from "~/components/Navbar";
import SearchBarAutocomplete from "~/components/SearchBar/AutoComplete";
import { LoadingSpinner } from "~/components/Loading";
const LeafletMap = dynamic(() => import("../components/LeafletMap"), {
  ssr: false,
});

const SearchPage: React.FC = () => {
  // this is used for filtering.
  // allow user to set insurance status (QUEST, none, or both)
  const [insurance, setInsurance] = useState<InsuranceProviders | undefined>();

  // if no insurance selected, select first 100 clinics.
  // if there is, plug it into our api.
  // this really needs to be one procedure with the insurance being optional.
  // this is unsorted. it is sorted however mongodb wants to sort it :)
  const { data: centers, isLoading } =
    insurance !== undefined
      ? api.healthcare.getByPlan.useQuery({ insurance })
      : api.healthcare.getSome.useQuery();

  return (
    <div className="h-screen overflow-hidden font-tyler">
      <Navbar />
      <div>
        <SearchBarAutocomplete />
      </div>
      <div className="flex h-[calc(100%-5rem)] w-screen">
        <div
          className="0 
                h-full w-1/5 flex-col bg-gray-100"
        >
          <p className="mb-2 mt-4 text-center text-xl font-semibold">
            Search Filters:
          </p>
          <div className="form-control w-full px-6">
            <label className="label">
              <span className="label-text text-base font-semibold">
                Insurance type
              </span>
            </label>
            <select className="select select-bordered text-base">
              <option disabled selected>
                Pick one
              </option>
              <option onClick={(p) => setInsurance("FQHC")}>Uninsured</option>
              <option onClick={(p) => setInsurance("QI")}>Med-QUEST</option>
              <option onClick={(p) => setInsurance(undefined)}>Any</option>
            </select>
          </div>
        </div>
        <div
          className="0 h-full w-1/2 flex-col overflow-y-scroll
                border-l-2 border-r-2 bg-white"
        >
          <p className="mb-6 mt-4 rounded-xl text-center text-4xl font-semibold">
            Search Results:
          </p>
          {/* tell the user to wait if we are still waiting on data to come in. 
                    DO NOT USE STATIC SITE GENERATION BECAUSE YOUTUBE DOESN'T DO THIS WHEN YOU SEARCH FOR VIDEOS
                    then, when we get the data we can map it out into a DIV for each center. rn we are missing a more info <button className=""></button>
                    */}
          {isLoading ? (
            <div className="mt-12 grid justify-items-center justify-self-center">
              <LoadingSpinner />
            </div>
          ) : (
            centers?.map((c) => (
              <div
                className={
                  "mx-12 mb-6 rounded-xl border-2 border-gray-100 bg-gray-100 p-4"
                }
                key={c.id}
              >
                <div className="l-20 text-2xl font-semibold">
                  <a
                    href={"/location/" + c.id}
                    className={
                      c.insurancePlans.includes("QI")
                        ? "text-dark-blue"
                        : "text-dark-blue"
                    }
                  >
                    {c.names[0] + " (" + (false || "Comprehensive Care") + ")"}
                  </a>
                </div>

                <div className="flex">
                  <div className="min-w-full break-words text-justify">
                    <div>{c.website}</div>
                    <div>{c.address}</div>
                    <div>{c.healthCenterNumbers}</div>
                    <div>{c.insurancePlans}</div>
                    <div className="[shape-outside:inset(calc(100% - 100px) 0 0)] float-right flex items-end">
                      <button
                        onClick={async (_) => {
                          let loc = "";
                          console.log(navigator.geolocation);
                          if (navigator.geolocation) {
                            loc = await new Promise((res) =>
                              navigator.geolocation.getCurrentPosition(
                                (p) =>
                                  res(
                                    p.coords.latitude +
                                    "," +
                                    p.coords.longitude,
                                  ),
                                (_err) => res(""),
                                {
                                  enableHighAccuracy: true,
                                },
                              ),
                            );
                          }
                          window.open(
                            "https://www.google.com/maps/dir/" +
                            loc +
                            "/" +
                            c.address,
                          );
                        }}
                        rel="noopener noreferrer"
                        className="text-md btn h-12 w-36 border-0 bg-light-green p-2 font-bold text-green-gray hover:bg-hover-green"
                      >
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* possibly feed the list of locations into here, it was requested/needed that the leaflet map should only show endpoints
                that are in the search results, but I bring up the problem of pagination again. */}
        <LeafletMap key={0} />
      </div>
    </div>
  );
};

export default SearchPage;
