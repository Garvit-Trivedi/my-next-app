
const students = [
  { id: 1, name: "hrh", age: 21, course: "Computer Science" },
  { id: 2, name: "oiahr", age: 22, course: "Electrical Engineering" },
  { id: 3, name: "wer", age: 20, course: "Mechanical Engineering" },
];

export async function GET() {
  return new Response(JSON.stringify(students), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}