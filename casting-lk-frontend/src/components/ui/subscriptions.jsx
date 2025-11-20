export default function Subscriptions() {
  const plans = [
    {
      name: "Basic",
      price: "$40",
      period: "mo",
      features: [
        "Access to voice casting database",
        "Basic voice matching",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$100",
      period: "mo",
      features: [
        "Everything in Basic",
        "Advanced voice matching algorithms",
        "Priority support",
        "Cast similarity reports",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$200",
      period: "mo",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 support",
      ],
      popular: false,
    },
  ];

  return (
    <section className="min-h-screen bg-#e7ebf flex flex-col items-center justify-center p-10 space-y-12">
      <h2 className="text-4xl font-bold text-indigo-700 mb-10">Subscription Plans</h2>
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-3 max-w-6xl w-full">
       {plans.map(({name,price,period,features,popular})=>(


          <div
            key={name}
             className={`relative bg-white rounded-3xl shadow-xl p-8 flex flex-col space-y-6 transition transform hover:scale-105 ${
              popular ? "border-4 border-indigo-600" : ""
            }`}
          >
          {popular && (
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
         )}
            <h3 className="text-2xl font-semibold text-indigo-800">{name}</h3>
            <div className="text-5xl font-bold text-indigo-700">
                   {price}
           
              <span className="text-xl font-normal text-gray-500">/{period}</span>

            </div>
            <ul className="flex-1 text-gray-700 list-disc list-inside space-y-2">
              {features.map((feature)=>(
             <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 transition">
              Choose Plan
            </button>
          </div>
       ))}
      </div>
    </section>
  );
}
