const LoginPage = () => {
  return (
    <main className="container mx-auto mt-14 px-4">
      {/* Naviation Bar */}
      <h1 className="text-5xl font-semibold capitalize text-left pl-4 text-title-md">
        welcome <br />
        <span className="text-primary">back.</span>
      </h1>

      <div className="input-canvas mt-14 p-4 rounded-lg py-8 border-0">
        <form className="grid grid-cols-1 space-y-6">
          <label className="font-medium">Email Address</label>
          <input type="email" placeholder="email@email.com" />
          <label className="font-medium">Password</label>
          <input type="password" placeholder="********" />

          <button className="btn-primary mt-4">sign in</button>
        </form>
      </div>
      <p className="uppercase opacity-70 text-center mt-8">or continue with</p>
    </main>
  );
};

export default LoginPage;
