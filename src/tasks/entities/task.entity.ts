import { Accountant } from "src/accountants/entities/accountant.entity";
import { Receptionist } from "src/receptionists/entities/receptionist.entity";
import { Technician } from "src/technicians/entities/technician.entity";
import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({ default: false })
    isComplete: boolean

    @Column()
    deadline: Date

    @OneToMany(() => TaskUser, user => user.task)
    users: TaskUser[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

@Check(`("receptionistId" IS NOT NULL AND "accountantId" IS NULL AND "technicianId" IS NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NOT NULL AND "technicianId" IS NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NULL AND "technicianId" IS NOT NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NULL AND "technicianId" IS NULL)`)
@Entity()
export class TaskUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Task, task => task.users, { onDelete: "CASCADE" })
    task: Task;

    @ManyToOne(() => Receptionist, receptionist => receptionist.tasks, { nullable: true, onDelete: "SET NULL" })
    receptionist: Receptionist

    @ManyToOne(() => Accountant, accountant => accountant.tasks, { nullable: true, onDelete: "SET NULL" })
    accountant: Accountant

    @ManyToOne(() => Technician, technician => technician.tasks, { nullable: true, onDelete: "SET NULL" })
    technician: Technician

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}