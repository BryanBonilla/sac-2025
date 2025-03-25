import { db } from "@/db";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ exp: string }> },
) {
  try {
    const {exp} = await params;
    const studentQr = await db
    .select({studentNumber: students.expediente, lego_image: students.lego_image})
    .from(students)
    .where(eq(students.expediente, parseInt(exp)));
    if(studentQr.length === 0){
      return NextResponse.json({error: 'Student not found'}, {status: 404});
    }
    const { studentNumber, lego_image } = studentQr[0];
    const response = {
      expediente: studentNumber,
      lego_image: lego_image
    }
    return NextResponse.json(response, {status: 200});
  } catch(error: any){
    return NextResponse.json(
      { error: "Bad Request" },
      { status: 400 }
    );
  }
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ exp: string }> },
){
  try {
    const {exp} = await params;
    const examplePayload = {
      nombre: "Dummy",
      lego_image: "base64image"
    };
    const body = await request.json();
    const isNotValidName = !body.nombre || typeof body.nombre !== 'string',
      isNotValidImage = (!body.lego_image || typeof body.lego_image !== 'string');
    if (isNotValidName) {
      return NextResponse.json(
	{error: "Field must be nombre string", example: examplePayload},
	{status: 400}
      );
    }
    if (isNotValidName)	{
      return NextResponse.json(
	{error: "Field must be lego_image", example: examplePayload},
	{status: 400}
      )
    }
    const studentQr = await db
      .insert(students)
      .values({expediente: parseInt(exp), nombre: body.nombre, lego_image: body.lego_image})
    const response = {
      message: "Image uploaded",
      data: studentQr
    };
    return NextResponse.json(response, {status: 201})
  } catch(error: any){
    return NextResponse.json(
      { error: "Bad Request" },
      { status: 400 }
    )
  }
}
