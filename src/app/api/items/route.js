
let items = [
  { id: 1, name: "mouse", price: 50000 },
  { id: 2, name: "phone", price: 20000 },
  { id: 3, name: "toy car", price: 3000 },
];


export async function GET(request) {
  return new Response(JSON.stringify(items), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


export async function POST(request) {
  const body = await request.json();
  const newItem = {
    id: Date.now(),
    name: body.name,
    price: body.price,
  };
  items.push(newItem);
  return new Response(JSON.stringify(newItem), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}


export async function PUT(request) {
  const body = await request.json();
  const { id, ...updateData } = body;

  items = items.map((item) =>
    item.id === id ? { ...item, ...updateData } : item
  );

  return new Response(
    JSON.stringify({ message: "Item updated", items }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}


export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id"));

  items = items.filter((item) => item.id !== id);

  return new Response(
    JSON.stringify({ message: "Item deleted", items }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}