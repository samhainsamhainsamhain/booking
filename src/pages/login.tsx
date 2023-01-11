import { useRouter } from "next/router";
import { ChangeEvent, FC, useState } from "react";
import { api } from "../utils/api";

type loginProps = {};

const login: FC<loginProps> = ({}: loginProps) => {
  const router = useRouter();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const { mutate: login, isError } = api.admin.login.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login(input);
  }

  return (
    <section className="h-screen">
      <div className="container m-auto h-full px-6 py-12">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-gray-800">
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-4/12">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Phone image"
            />
          </div>
          <div className="md:w-8/12 lg:ml-20 lg:w-4/12">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  name="email"
                  onChange={handleChange}
                  value={input.email}
                  className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-2 text-xl font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                  placeholder="Email address"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={input.password}
                  className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-2 text-xl font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                  placeholder="Password"
                />
              </div>
              <div className="mb-6 flex items-center justify-between">
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                    id="exampleCheck2"
                  />
                  <label
                    className="form-check-label inline-block cursor-pointer text-gray-800"
                    htmlFor="exampleCheck2"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#!"
                  className="text-blue-600 transition duration-200 ease-in-out hover:text-blue-700 focus:text-blue-700 active:text-blue-800"
                >
                  Forgot password?
                </a>
              </div>
              {isError && (
                <p className="my-3 inline-block w-full rounded bg-red-600 px-7 py-3 text-center text-sm font-medium uppercase leading-snug text-white">
                  Invalid login credentials
                </p>
              )}
              <button
                disabled={!input.email || !input.password}
                type="submit"
                className="inline-block w-full rounded bg-blue-600 px-7 py-3 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default login;
