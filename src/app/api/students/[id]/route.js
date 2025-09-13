
const students = [
  { id: 1, name: "Garvit", age: 21, course: "Computer Science" },
  { id: 2, name: "Mohit", age: 22, course: "Electrical Engineering" },
  { id: 3, name: "Mahir", age: 20, course: "Mechanical Engineering" },
];


export async function GET(request, { params }) {

  const id = parseInt(params.id);

  const student = students.find((s) => s.id === id);

  if (!student) {
    return new Response(JSON.stringify({ error: "Student not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(student), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}