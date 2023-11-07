import type { GetStaticProps, NextPage } from "next";
import Navbar from "~/components/Navbar";
import getServerSideHelper from "~/server/helpers/ServerSideHelper";
import { api } from "~/utils/api";

const LocationDestination: NextPage<{ id: string }> = ({ id }) => {
    const { data } = api.healthcare.getById.useQuery({ id });
    return (
        <>
            <Navbar />
            <div className="w-full font-tyler ">
                {data ? (
                    <>
                        <div className="flex flex-col w-screen text-white bg-dark-blue gap-4 py-16 px-60">

                            <div className=" items-center text-6xl font-bold ">
                                {data.names[0]}
                            </div>
                            <a className="normal-case mt-3 btn w-40 h-14 text-xl bg-light-green hover:bg-hover-green text-green-gray border-0 "
                                onClick={_ => window.history.back()}
                            >
                                Go back
                            </a>
                        </div>

                        {/* <div className="grid grid-cols-2 h-full py-6 px-60"> */}
                        <div className="flex">
                            <div className="w-3/5 pl-60 pt-16 relative">

                                <div className="pt-10x h-96">

                                    <h1 className="w-full text-3xl font-semibold">Clinic Description:</h1>
                                    <div className="mr-4 pb-6 flex flex-col">

                                        <div className="join join-vertical lg:join-horizontal pt-4">
                                            <h2 className="join-item text-2xl font-semibold">Clinic Name:</h2>
                                            <p className="join-item text-2xl indent-16">{data.names[0]}</p>
                                        </div>

                                        

                                        <div className="join join-vertical lg:join-horizontal pt-4">
                                            <h2 className="join-item text-2xl font-semibold">Procedure Type:</h2>
                                            <p className="join-item text-2xl indent-6">{data.procedureTypes.map((p) => p.name)}</p>
                                        </div>



                                        <div className="join join-vertical lg:join-horizontal pt-4">
                                            <h2 className="join-item text-2xl font-semibold">Clinic Phone:</h2>
                                            <p className="join-item text-2xl indent-16">{data.healthCenterNumbers[0]}</p>
                                        </div>

                                        
                                        {/* }
                                        {data.procedureTypes.map((p) => p.insurancePlan) == "FQHC" &&
                                            <div className="pt-4">
                                                <h2 className="text-2xl font-semibold">What is a sliding fee program?</h2>
                                                <p className="text-xl pt-4">A program designed to reduce the cost of primary care for those who meet income requirements.</p>
                                            </div>
                                        } */}
                                    
                                        <div className="flex flex-row absolute bottom-0 ">

                                            <a target="_blank" className="normal-case mx-10 mt-3 btn w-48 h-16 text-xl bg-med-blue hover:bg-hover-blue text-black border-0 " href={data.website} >
                                                Clinic Website
                                            </a>

                                            {/* send user to the corresponding review page when clicked */}
                                            <a className="normal-case mx-10 mt-3 btn w-48 h-16 text-xl bg-med-blue hover:bg-dark-blue text-black border-0 "
                                                href={"/review/" + data.id}>
                                                Review clinic
                                            </a>

                                            <button className="normal-case mx-10 mt-3 btn w-48 h-16 text-xl bg-med-blue hover:bg-dark-blue text-black border-0 "
                                                onClick={async (_) => {
                                                    let loc = "";
                                                    console.log(navigator.geolocation)
                                                    if (navigator.geolocation) {
                                                        loc = await new Promise((res) =>
                                                            navigator.geolocation.getCurrentPosition(
                                                                p => res(p.coords.latitude + ',' + p.coords.longitude),
                                                                _err => res(""),
                                                                {
                                                                    enableHighAccuracy: true
                                                                }
                                                            )
                                                        );
                                                    };
                                                    window.open("https://www.google.com/maps/dir/" + loc + "/" + data.address);
                                                }}
                                                rel="noopener noreferrer" >
                                                Get Directions
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="w-2/5 pr-60 pt-10">
                                <iframe className="w-full h-full ml-auto"
                                    src={
                                        "https://www.google.com/maps/?output=embed&q=" +
                                        data.address
                                    }
                                />
                            </div>
                        </div>




                    </>

                ) : (
                    <>
                        <div className="mt-1/2 h-full text-center text-2xl ">
                            Clinic not found
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

{/* weird code used for static site generation so we dont stress out the database or something */ }
export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = getServerSideHelper();
    {/* note how the file is called [id]. we get that parameter... */ }
    const id = context.params?.id;
    if (typeof id !== "string") throw new Error("ID Not found");

    {/* and pre-fetch it on our side, so when loaded in the above function, we dont have to make the end user come to us asking for it */ }
    await ssg.healthcare.getById.prefetch({ id });
    return {
        props: {
            // dude idk how this works
            trpcState: ssg.dehydrate(),

            // give the id so we can pull it from the object in the main function
            id,
        },
    };
};

// neither does this
export const getStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
};

export default LocationDestination;



