import { Parameter } from "src/parameters/entities/parameter.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Technician {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: 23, update: false })
    role: number;

    @Column({ nullable: true })
    image: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true, unique: true })
    phone: string;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @OneToMany(() => Parameter, parameter => parameter.technician, { onDelete: "SET NULL" })
    parameters: Parameter[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
